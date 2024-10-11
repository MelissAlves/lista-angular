import { Login } from './login';

describe('Login Interface', () => {
  it('should create a valid Login object', () => {
    const login: Login = {
      id: 1,
      name: 'Usuário Exemplo',
      email: 'usuario@example.com',
      password: 'senha123@',
      token: 'abc123xyz' // token é opcional
    };

    expect(login.id).toEqual(1);
    expect(login.name).toEqual('Usuário Exemplo');
    expect(login.email).toEqual('usuario@example.com');
    expect(login.password).toEqual('senha123@');
    expect(login.token).toEqual('abc123xyz');
  });

  it('should allow creation without token', () => {
    const login: Login = {
      id: 2,
      name: 'Outro Usuário',
      email: 'outro.usuario@example.com',
      password: 'senha456@'
    };

    expect(login.id).toEqual(2);
    expect(login.name).toEqual('Outro Usuário');
    expect(login.email).toEqual('outro.usuario@example.com');
    expect(login.password).toEqual('senha456');
    expect(login.token).toBeUndefined();
  });

  it('should have the correct types', () => {
    const login: Login = {
      id: 3,
      name: 'Usuário Teste',
      email: 'teste@exemplo.com',
      password: 'senha789@'
    };

    expect(typeof login.id).toBe('number');
    expect(typeof login.name).toBe('string');
    expect(typeof login.email).toBe('string');
    expect(typeof login.password).toBe('string');
    expect(typeof login.token).toBe('undefined');
  });
});
