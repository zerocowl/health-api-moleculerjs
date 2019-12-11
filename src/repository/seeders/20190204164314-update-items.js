'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const created_at = new Date();
    const updated_at = new Date();
    return queryInterface.bulkInsert('items', [
      {
        action_name: 'Agendar consultas com desconto',
        action_name_alt: 'Agendar consultas sem desconto',
        action_url: '/paciente/encontre-um-medico',
        created_at,
        category: 'partial',
        default: true,
        description:
          'Agende suas consultas médicas com preços acessíveis. Busque e encontre a especialidade que precisa e marque sua consulta com desconto o quanto antes! Consultas a partir de R$47.',
        description_canceled:
          '* Este serviço é válido somente na versão paga. Ative sua assinatura e utilize todos os benefícios. ',
        description_pending:
          '* Este serviço é válido somente na versão paga. No momento estamos aguardando a confirmação de pagamento. Qualquer problema, entre em contato!',
        description_pending_minha_claro:
          '* Sua assinatura não pôde ser renovada por falta de saldo. Para usar os serviços do Doutor Já, faça uma recarga.',
        description_trial:
          '* Durante o período de experimentação de 7 dias você não terá desconto em consultas. Renove sua assinatura no dia $RENEWAL_DATE para utilizar os descontos.',
        id: 11,
        short_name: 'consultas',
        title: 'Consultas Médicas com Desconto',
        title_alt: 'Consultas Médicas sem Desconto',
        updated_at
      },
      {
        action_name: 'Agendar Exames com Desconto',
        action_name_alt: 'Agendar Exames sem Desconto',
        action_url: '/paciente/agendamento-de-exame',
        created_at,
        category: 'partial',
        default: true,
        description:
          'Agende seus exames com preços acessíveis. Mande uma foto com o pedido do exame e aguarde que iremos marcar para você o quanto antes! Exames com até 40% de desconto.',
        description_canceled:
          '* Este serviço é válido somente na versão paga. Ative sua assinatura e utilize todos os benefícios. !',
        description_pending:
          '* Este serviço é válido somente na versão paga. No momento estamos aguardando a confirmação de pagamento. Qualquer problema, entre em contato!',
        description_pending_minha_claro:
          '* Sua assinatura não pode ser renovada por falta de saldo. Para usar os serviços do Doutor Ja, faça uma recarga.',
        description_trial:
          '* Durante o período de experimentação de 7 dias você não terá desconto em consultas. Renove sua assinatura no dia $RENEWAL_DATE para utilizar os descontos.',
        id: 12,
        short_name: 'exames',
        title: 'Exames de Imagem e Laboratoriais com Desconto',
        title_alt: 'Exames de Imagem e Laboratoriais sem Desconto',
        updated_at
      },
      {
        action_name: 'Ver Farmácias Parceiras',
        action_name_alt: 'Ver Farmácias Parceiras',
        action_url: '/paciente/farmacias',
        created_at,
        category: 'exclusive',
        default: true,
        description:
          'Compre medicamentos com até 60% de desconto em mais de 21.000 farmácias espalhadas pelo Brasil. Escolha a mais perto da sua casa, apresente seu Cartão Doutor Já e utilize os descontos',
        description_canceled:
          '* Este serviço é válido somente na versão paga. Ative sua assinatura e utilize todos os benefícios. !',
        description_pending:
          '* Este serviço é válido somente na versão paga. No momento estamos aguardando a confirmação de pagamento. Qualquer problema, entre em contato!',
        description_pending_minha_claro:
          '* Sua assinatura não pode ser renovada por falta de saldo. Para usar os serviços do Doutor Ja, faça uma recarga.',
        description_trial:
          '* Este serviço é válido somente na versão paga. No momento, você está na Experimentação. Renove a sua assinatura ao no dia $RENEWAL_DATE para utilizar este serviço.',
        id: 13,
        short_name: 'farma',
        title: 'Medicamentos com Desconto',
        title_alt: 'Medicamentos com Desconto',
        updated_at
      },
      {
        action_name: 'Ligue aqui',
        action_name_alt: 'Ligue aqui',
        action_url: 'tel:08009415456',
        created_at,
        category: 'exclusive',
        default: false,
        description:
          'Ligue para o nosso 0800 e tenha um médico 24 horas por telefone. Tenha orientação em casos de emergência, preparo para exames, esclareça dúvidas e diagnósticos. Este serviço precisa ser ativado.',
        description_canceled:
          '* Este serviço é válido somente na versão paga. Ative sua assinatura e utilize todos os benefícios. !',
        description_pending:
          '* Este serviço é válido somente na versão paga. No momento estamos aguardando a confirmação de pagamento. Qualquer problema, entre em contato!',
        description_pending_minha_claro:
          '* Sua assinatura não pode ser renovada por falta de saldo. Para usar os serviços do Doutor Ja, faça uma recarga.',
        description_trial:
          '* Este serviço é válido somente na versão paga. No momento, você está na Experimentação. Renove a sua assinatura ao no dia $RENEWAL_DATE para utilizar este serviço.',
        id: 14,
        short_name: 'orient',
        title: 'Orientação Médica por Telefone',
        title_alt: 'Orientação Médica por Telefone',
        updated_at
      },
      {
        action_name: 'Ligue aqui',
        action_name_alt: 'Ligue aqui',
        action_url: 'tel:08009415456',
        created_at,
        category: 'exclusive',
        default: false,
        description:
          'Ligue para o nosso 0800 e tenha um farmacêutico disponível para você 24 horas por telefone. Tenha orientação sobre o uso adequado de remédios, horários, doses e contra-indicações.',
        description_canceled:
          '* Este serviço é válido somente na versão paga. Ative sua assinatura e utilize todos os benefícios. !',
        description_pending:
          '* Este serviço é válido somente na versão paga. No momento estamos aguardando a confirmação de pagamento. Qualquer problema, entre em contato!',
        description_pending_minha_claro:
          '* Sua assinatura não pode ser renovada por falta de saldo. Para usar os serviços do Doutor Ja, faça uma recarga.',
        description_trial:
          '*Este serviço é válido somente na versão paga. No momento, você está na Experimentação. Renove a sua assinatura ao no dia $RENEWAL_DATE para utilizar este serviço.',
        id: 15,
        short_name: 'assist',
        title: 'Orientação Farmacêutica por telefone',
        title_alt: 'Orientação Farmacêutica por telefone',
        updated_at
      },
      {
        action_name: 'Adicionar Dependentes',
        action_name_alt: 'Adicionar Dependentes',
        action_url: '/paciente/dependentes',
        created_at,
        category: 'open',
        default: true,
        description:
          'Adicione aqui os 03 dependentes. Eles poderão marcar consultas e exames com desconto. Não tem limite de Idade. Não tem carência',
        description_canceled:
          'Adicione aqui os 03 dependentes. Eles poderão marcar consultas e exames com desconto. Não tem limite de Idade. Não tem carência',
        description_pending:
          'Adicione aqui os 03 dependentes. Eles poderão marcar consultas e exames com desconto. Não tem limite de Idade. Não tem carência',
        description_pending_minha_claro:
          'Adicione aqui os 03 dependentes. Eles poderão marcar consultas e exames com desconto. Não tem limite de Idade. Não tem carência',
        description_trial:
          'Adicione aqui os 03 dependentes. Eles poderão marcar consultas e exames com desconto. Não tem limite de Idade. Não tem carência',
        id: 16,
        short_name: 'dependent',
        title: '3 Dependentes para Consultas e Exames',
        title_alt: '3 Dependentes para Consultas e Exames',
        updated_at
      },
      {
        action_name: 'Meu Cartão Doutor Já',
        action_name_alt: 'Meu Cartão Doutor Já',
        action_url: '/paciente/cartao',
        created_at,
        category: 'open',
        default: true,
        description:
          'Não tenha mais que se preocupar em levar o Cartão Físico Doutor Já  para obter descontos. Agora ele é virtual e está na palma da sua mão. Entre aqui e utilize o seu Cartão Virtual  sempre que precisar!',
        description_canceled:
          'Não tenha mais que se preocupar em levar o Cartão Físico Doutor Já  para obter descontos. Agora ele é virtual e está na palma da sua mão. Entre aqui e utilize o seu Cartão Virtual  sempre que precisar!',
        description_pending:
          'Não tenha mais que se preocupar em levar o Cartão Físico Doutor Já  para obter descontos. Agora ele é virtual e está na palma da sua mão. Entre aqui e utilize o seu Cartão Virtual  sempre que precisar!',
        description_pending_minha_claro:
          'Não tenha mais que se preocupar em levar o Cartão Físico Doutor Já  para obter descontos. Agora ele é virtual e está na palma da sua mão. Entre aqui e utilize o seu Cartão Virtual  sempre que precisar!',
        description_trial:
          'Não tenha mais que se preocupar em levar o Cartão Físico Doutor Já  para obter descontos. Agora ele é virtual e está na palma da sua mão. Entre aqui e utilize o seu Cartão Virtual  sempre que precisar!',
        id: 17,
        short_name: 'card',
        title: 'Cartão Virtual',
        title_alt: 'Cartão Virtual',
        updated_at
      },
      {
        action_name: 'Acessar o Guia de Bem-Estar',
        action_name_alt: 'Acessar o Guia de Bem-Estar',
        action_url: '/blog',
        created_at,
        category: 'open',
        default: true,
        description:
          'Tire dúvidas, leia curiosidades e fique por dentro das novidades. Cuide da sua saúde de forma preventiva!',
        description_canceled:
          'Tire dúvidas, leia curiosidades e fique por dentro das novidades. Cuide da sua saúde de forma preventiva!',
        description_pending:
          'Tire dúvidas, leia curiosidades e fique por dentro das novidades. Cuide da sua saúde de forma preventiva!',
        description_pending_minha_claro:
          'Tire dúvidas, leia curiosidades e fique por dentro das novidades. Cuide da sua saúde de forma preventiva!',
        description_trial:
          'Tire dúvidas, leia curiosidades e fique por dentro das novidades. Cuide da sua saúde de forma preventiva!',
        id: 18,
        short_name: 'book',
        title: 'Guia de Saúde e Bem-Estar',
        title_alt: 'Guia de Saúde e Bem-Estar',
        updated_at
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('items', null, {});
  }
};
