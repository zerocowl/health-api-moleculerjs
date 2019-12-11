const { ServiceBroker } = require('moleculer');
const { ValidationError } = require('moleculer').Errors;
const TestService = require('../../services/pbm.vidalink.service');

describe("Test 'pbm.vidalink' service", () => {
  let broker = new ServiceBroker({
    validation: false
  });
  broker.createService(TestService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe('CT-001', () => {
    it('CT-001', () => {
      let params = {
        city: 'Rio de Janeiro',
        cpf: '01533465231',
        first_name: 'Leonardo',
        last_name: 'Monteiro',
        periodicity: {
          interval: 7,
          interval_type: 'day'
        },
        state: 'RJ',
        subscription_id: 1
      };
      let action = broker.call('pbm.vidalink.enable', params)
      expect(action).resolves.toBe(true);
    });
  });
});
