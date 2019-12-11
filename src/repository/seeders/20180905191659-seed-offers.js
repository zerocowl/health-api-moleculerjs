'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'offers',
      [
        {
          id: 1,
          active: true,
          regular_price: 475,
          description: 'flex semanal mobile',
          discount: 0,
          plan_id: 2,
          periodicity_id: 1,
          contractor_type: 'pf',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          active: true,
          regular_price: 1999,
          description: 'flex mensal',
          discount: 0,
          plan_id: 2,
          periodicity_id: 2,
          contractor_type: 'pf',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          active: true,
          regular_price: 17980,
          description: 'flex anual',
          discount: 0,
          plan_id: 2,
          periodicity_id: 3,
          contractor_type: 'pf',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 8,
          active: true,
          regular_price: 1490,
          description: 'flex mensal - redevip',
          discount: 25,
          plan_id: 2,
          periodicity_id: 2,
          contractor_type: 'pf',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 9,
          active: true,
          regular_price: 17980,
          description: 'flex anual - redevip',
          discount: 0,
          plan_id: 2,
          periodicity_id: 3,
          contractor_type: 'pf',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 10,
          active: true,
          regular_price: 1490,
          description: 'flex mensal asserj',
          discount: 0,
          plan_id: 2,
          periodicity_id: 2,
          contractor_type: 'pf',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 11,
          active: true,
          regular_price: 1490,
          description: 'empresarial flex mensal - super rede',
          discount: 0,
          plan_id: 1,
          periodicity_id: 2,
          contractor_type: 'pj',
          beneficiary_type: 'pf',
          payer_type: 'pj',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 12,
          active: true,
          regular_price: 9990,
          description: 'flex anual - botafogo',
          discount: 0,
          plan_id: 2,
          periodicity_id: 3,
          contractor_type: 'pf',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 13,
          active: true,
          regular_price: 1490,
          description: 'flex mensal - botafogo',
          discount: 0,
          plan_id: 2,
          periodicity_id: 2,
          contractor_type: 'pf',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 14,
          active: true,
          regular_price: 1490,
          description: 'flex mensal - cabify',
          discount: 0,
          plan_id: 2,
          periodicity_id: 2,
          contractor_type: 'pf',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 15,
          active: true,
          regular_price: 0,
          description: 'flex funcional',
          discount: 0,
          plan_id: 3,
          periodicity_id: 2,
          contractor_type: 'pj',
          beneficiary_type: 'pf',
          payer_type: 'pj',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 16,
          active: true,
          regular_price: 0,
          description: 'flex rede credenciada VIP',
          discount: 0,
          plan_id: 3,
          periodicity_id: 2,
          contractor_type: 'pj',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 17,
          active: true,
          regular_price: 0,
          description: 'flex convidados VIP',
          discount: 0,
          plan_id: 3,
          periodicity_id: 2,
          contractor_type: 'pj',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 18,
          active: true,
          regular_price: 0,
          description: 'flex mensal freemium',
          discount: 0,
          plan_id: 2,
          periodicity_id: 2,
          contractor_type: 'pf',
          beneficiary_type: 'pf',
          payer_type: 'pf',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 19,
          active: true,
          regular_price: 1490,
          description: 'empresarial flex mensal - redevip',
          discount: 0,
          plan_id: 1,
          periodicity_id: 2,
          contractor_type: 'pj',
          beneficiary_type: 'pf',
          payer_type: 'pj',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {
        updateOnDuplicate: [
          'active',
          'regular_price',
          'description',
          'discount',
          'plan_id',
          'periodicity_id',
          'beneficiary_type',
          'contractor_type',
          'payer_type'
        ]
      }
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('offers', null, {});
  }
};