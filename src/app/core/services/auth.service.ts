import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Session, SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Cliente, RegistroInput } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private client: SupabaseClient | null = null;

  readonly session = signal<Session | null>(null);
  readonly perfil = signal<Cliente | null>(null);
  readonly cargando = signal(false);
  readonly logueado = computed(() => !!this.session());
  readonly verificado = computed(() => this.perfil()?.verificado ?? false);
  readonly esAdmin = computed(() => this.perfil()?.is_admin ?? false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.client = createClient(
        environment.supabase.url,
        environment.supabase.anonKey,
        { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
      );
      this.client.auth.getSession().then(({ data }) => {
        this.session.set(data.session);
        if (data.session) this.cargarPerfil();
      });
      this.client.auth.onAuthStateChange((_evt, sess) => {
        this.session.set(sess);
        if (sess) this.cargarPerfil();
        else this.perfil.set(null);
      });
    }
  }

  get db(): SupabaseClient {
    if (!this.client) throw new Error('Auth solo en navegador');
    return this.client;
  }

  async registrar(input: RegistroInput) {
    this.cargando.set(true);
    try {
      const { data, error } = await this.db.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: { nombre: input.nombre, telefono: input.telefono ?? null },
          emailRedirectTo: this.redirectUrl('/auth/verificado')
        }
      });
      if (error) throw error;
      return data;
    } finally {
      this.cargando.set(false);
    }
  }

  async login(email: string, password: string) {
    this.cargando.set(true);
    try {
      const { data, error } = await this.db.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } finally {
      this.cargando.set(false);
    }
  }

  async logout() {
    await this.db.auth.signOut();
    this.perfil.set(null);
  }

  async recuperarPassword(email: string) {
    const { error } = await this.db.auth.resetPasswordForEmail(email, {
      redirectTo: this.redirectUrl('/auth/restablecer')
    });
    if (error) throw error;
  }

  async actualizarPassword(nueva: string) {
    const { error } = await this.db.auth.updateUser({ password: nueva });
    if (error) throw error;
  }

  async reenviarVerificacion(email: string) {
    const { error } = await this.db.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: this.redirectUrl('/auth/verificado') }
    });
    if (error) throw error;
  }

  async cargarPerfil() {
    const uid = this.session()?.user.id;
    if (!uid) return;
    const { data, error } = await this.db
      .from('clientes')
      .select('*')
      .eq('id', uid)
      .maybeSingle();
    if (error) {
      console.error(error);
      return;
    }
    this.perfil.set(data as Cliente);
  }

  private redirectUrl(path: string): string {
    if (typeof window === 'undefined') return path;
    return `${window.location.origin}${path}`;
  }
}
