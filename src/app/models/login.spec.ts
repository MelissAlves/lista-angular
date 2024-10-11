import { Login } from './login';

describe('Login', () => {
  it('should create a valid ListaInterface object', () => {
    const lista: Login = {
      id: 1,
      name: 'Teste',
      email: 'teste@teste.com',
      password: 'senha123@',
      token: '1212233'
    };

    expect(lista.id).toEqual(1);
    expect(lista.name).toEqual('Teste');
    expect(lista.email).toEqual('teste@teste.com');
    expect(lista.password).toEqual('senha123@');
    expect(lista.token).toEqual('1212233');
  });

  it('should have the correct types', () => {
    const lista: Login = {
      id: 2,
      name: "Teste 2",
      email: "teste2@arctica.com",
      password: "Arctica@1",
      token: "0002"
    };
    expect(lista.id).toEqual(2);
    expect(lista.name).toEqual('Teste 2');
    expect(lista.email).toEqual('teste2@arctica.com');
    expect(lista.password).toEqual('Arctica@1');
    expect(lista.token).toEqual('0002');
  });
});
