import { ListaInterface } from './lista-tarefa';

describe('ListaInterface', () => {
  it('should create a valid ListaInterface object', () => {
    const lista: ListaInterface = {
      id: '1',
      name: 'Tarefa Exemplo',
      updatedBy: 'Usuário Exemplo',
      updateDate: new Date('2024-10-10'),
      endDate: new Date('2024-10-20'),
      status: 'Em andamento'
    };

    expect(lista.id).toEqual('1');
    expect(lista.name).toEqual('Tarefa Exemplo');
    expect(lista.updatedBy).toEqual('Usuário Exemplo');
    expect(lista.updateDate).toEqual(new Date('2024-10-10'));
    expect(lista.endDate).toEqual(new Date('2024-10-20'));
    expect(lista.status).toEqual('Em andamento');
  });

  it('should have the correct types', () => {
    const lista: ListaInterface = {
      id: '2',
      name: 'Outra Tarefa',
      updatedBy: 'Outro Usuário',
      updateDate: new Date(),
      endDate: new Date(),
      status: 'Concluída'
    };

    expect(typeof lista.id).toBe('string');
    expect(typeof lista.name).toBe('string');
    expect(typeof lista.updatedBy).toBe('string');
    expect(lista.updateDate instanceof Date).toBe(true);
    expect(lista.endDate instanceof Date).toBe(true);
    expect(typeof lista.status).toBe('string');
  });
});
