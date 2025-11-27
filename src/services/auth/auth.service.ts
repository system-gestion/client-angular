import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  UsuarioLogin,
  LoginResponse,
  LogoutResponse,
  MeResponse,
} from '@interface/auth/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private userSignal = signal<MeResponse | null>(null);
  private tokenSignal = signal<string | null>(null);
  private numSesionSignal = signal<number | null>(null);

  user = this.userSignal.asReadonly();
  token = this.tokenSignal.asReadonly();
  numSesion = this.numSesionSignal.asReadonly();
  isAuthenticated = computed(() => this.userSignal() !== null && this.tokenSignal() !== null);

  constructor() {}

  login(credenciales: UsuarioLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_URL.auth.login, credenciales).pipe(
      tap((response) => {
        this.userSignal.set(response.usuario);
        this.tokenSignal.set(response.access_token);
        this.numSesionSignal.set(response.num_sesion);
        this.saveToStorage(response);
      })
    );
  }

  logout(num_sesion?: number): Observable<LogoutResponse> {
    const sesion = num_sesion || this.numSesionSignal();
    if (!sesion) {
      this.clearSession();
      return new Observable<LogoutResponse>((observer) => {
        observer.next({ message: 'Sesión cerrada localmente' });
        observer.complete();
      });
    }

    return this.http
      .post<LogoutResponse>(API_URL.auth.logout(sesion), {})
      .pipe(tap(() => this.clearSession()));
  }

  getCurrentUser(cod_usuario: number): Observable<MeResponse> {
    return this.http
      .get<MeResponse>(API_URL.auth.me(cod_usuario))
      .pipe(tap((usuario) => this.userSignal.set(usuario)));
  }

  hasNivel(nivel: number): boolean {
    const user = this.userSignal();
    return user?.nivel === nivel;
  }

  hasAnyNivel(niveles: number[]): boolean {
    const user = this.userSignal();
    if (!user) return false;
    return niveles.includes(user.nivel);
  }

  isSupervisor(): boolean {
    return this.hasNivel(1);
  }

  isVendedor(): boolean {
    return this.hasNivel(2);
  }

  isCliente(): boolean {
    return this.hasNivel(3);
  }

  setNumSesion(numSesion: number): void {
    this.numSesionSignal.set(numSesion);
    if (typeof window !== 'undefined') {
      localStorage.setItem('num_sesion', numSesion.toString());
    }
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private saveToStorage(response: LoginResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.usuario));
      localStorage.setItem('num_sesion', response.num_sesion.toString());
    }
  }

  private clearSession(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    this.numSesionSignal.set(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('num_sesion');
    }
  }

  restoreSession(): void {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    const numSesionStr = localStorage.getItem('num_sesion');

    if (token && userStr && numSesionStr) {
      this.tokenSignal.set(token);
      this.userSignal.set(JSON.parse(userStr));
      this.numSesionSignal.set(parseInt(numSesionStr));
    } else {
      console.log('No session to restore');
    }
  }
  getCodCliente(): string | null {
    const user = this.userSignal();
    if (!user || user.nivel !== 3) return null;
    return user.cod_cliente || null;
  }
}
