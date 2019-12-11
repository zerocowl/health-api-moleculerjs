'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('items', [
      {
        id: 1,
        name: 'consultas médicas',
        default: true,
        action_name: '',
        action_url: '',
        short_name: 'consultas',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'guia de saúde e bem-estar',
        default: true,
        description:
          'Tira suas dúvidas\nLeia curiosidades\nVeja novidades\nCuide da sua saúde de forma preventiva',
        action_name: 'Acessar o Guia de Bem-Estar',
        action_url: '',
        short_name: 'book',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'cartão virtual',
        default: true,
        action_name: '',
        action_url: '',
        short_name: 'card',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'consultas médicas com desconto',
        default: true,
        description:
          'Agende suas consultas aqui!\nBusque e encontre a especialidade que precisa o mais perto da sua casa e marque sua consulta com desconto!\nNão perca mais tempo e cuide cada vez mais da sua saúde.\nConsultas a partir de R$57',
        action_name: 'Marcar minha consulta',
        action_url: '/paciente/encontre-um-medico',
        short_name: 'pig',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        name: 'cartão virtual e físico',
        default: true,
        description: '',
        action_name: 'Visualizar cartão',
        action_url: '/paciente/visualizar-cartao',
        short_name: 'card',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        name: 'exames de imagem e laboratoriais com desconto',
        default: true,
        description:
          'Agende seus exames aqui!\nMande uma foto com o pedido do exame e aguarde que iremos marcar para você o mais perto da sua casa!\nPode ficar mais tranquilo!\nAqui os exames são bem mais em conta e possuem um desconto de até 40%',
        action_name: 'Marcar meu exame',
        action_url: '',
        short_name: 'exames',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        name: 'Medicamentos com desconto',
        default: true,
        description:
          'Agora ficou bem mais fácil economizar nos seus medicamentos!\nVeja todas as 21.000 farmácias participantes dos descontos e escolha a mais perto da sua casa.\nConfira a lista com o percentual de desconto sobre cada medicamento.\nOs descontos são de até 60%.',
        action_name: 'Ver as farmácias participantes',
        action_url: '/paciente/rede-credenciada',
        short_name: 'farma',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        name: 'Orientação Médica por telefone',
        default: true,
        description:
          'Ligue para o 0800 941 5456 e tenha um médico 24 horas por telefone.\nConte com orientação em casos de emergência\nTenha orientação para preparo de Exames\nEsclareça dúvidas e diagnósticos',
        action_name: 'Ligue aqui',
        action_url: 'tel:08009415456',
        short_name: 'orient',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 9,
        name: 'Orientação Farmacêutica por telefone',
        default: true,
        description:
          'Ligue para o 0800 941 5456 e tenha um farmacêutico 24 horas por telefone.\nConte com orientação sobre o uso adequado do remédio\nSaiba algumas contra indicações de alguns medicamentos\nTenha orientação sobre horário correto para tomar o remédio',
        action_name: 'Ligue aqui',
        action_url: 'tel:08009415456',
        short_name: 'assist',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 10,
        name: '3 dependentes para consultas e exames',
        default: true,
        description:
          'Adicione aqui os 03 dependentes\nEles poderão marcar consultas e exames com desconto\nNão tem limite de Idade\nNão tem carência',
        action_name: 'Adicionar Dependentes',
        action_url: '/paciente/dependentes',
        short_name: 'dependent',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('services', null, {});
  }
};
