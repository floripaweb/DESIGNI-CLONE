import React, { useState } from 'react';
import { PageView, User, UserRole } from '../types';
import { authenticateUser, saveUser } from '../services/storageService';

interface AuthPageProps {
  view: PageView.LOGIN | PageView.REGISTER;
  setPageView: (view: PageView) => void;
  onLoginSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ view, setPageView, onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const formatPhone = (value: string) => {
    // Remove non-numeric
    const numbers = value.replace(/\D/g, '');
    // Mask: (xx) xxxxx-xxxx
    const char = { 0: '(', 2: ') ', 7: '-' };
    let formatted = '';
    for (let i = 0; i < numbers.length; i++) {
      if (char[i as keyof typeof char]) formatted += char[i as keyof typeof char];
      formatted += numbers[i];
    }
    return formatted.slice(0, 15);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      setError('O telefone deve estar no formato (xx) xxxxx-xxxx');
      return;
    }

    if (view === PageView.LOGIN) {
      const user = authenticateUser(email, phone);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError('Credenciais inválidas. Verifique e-mail e telefone (senha).');
      }
    } else {
      // Register
      // Check if already exists (simplified check)
      const existing = authenticateUser(email, phone);
      if (existing) {
        setError('Usuário já cadastrado.');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        role: UserRole.USER
      };
      saveUser(newUser);
      onLoginSuccess(newUser);
    }
  };

  const isRegister = view === PageView.REGISTER;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4">
            D
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {isRegister ? 'Crie sua conta grátis' : 'Bem-vindo de volta'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isRegister 
              ? 'Junte-se à comunidade de criativos.' 
              : 'Acesse seus recursos favoritos.'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {isRegister && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Seu nome"
                />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-1">Endereço de E-mail</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="seu@email.com"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Telefone (Sua Senha)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={handlePhoneChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="(11) 99999-9999"
              />
              <p className="mt-1 text-xs text-slate-500">
                Use o formato (xx) xxxxx-xxxx como sua senha de acesso.
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded border border-red-100">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              {isRegister ? 'Cadastrar' : 'Entrar'}
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-slate-600">
            {isRegister ? 'Já tem uma conta? ' : 'Não tem conta? '}
            <button
              onClick={() => setPageView(isRegister ? PageView.LOGIN : PageView.REGISTER)}
              className="font-medium text-primary hover:text-blue-500"
            >
              {isRegister ? 'Faça login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
