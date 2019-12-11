module.exports = {
  development: {
    database: 'v2_doutorjadb_development',
    dialect: 'mysql',
    host: '127.0.0.1',
    password: 'doutorjadbpassword',
    logging: false,
    pool: {
      max: 5,
      min: 1,
      idle: 20000,
      acquire: 20000,
      evict: 60000,
      handleDisconnects: true
    },
    port: '3306',
    seederStorage: 'sequelize',
    username: 'doutorjadbuser'
  },
  'development:docker': {
    database: 'v2_doutorjadb_development',
    dialect: 'mysql',
    host: 'db',
    logging: false,
    operatorsAliases: false,
    password: 'doutorjadbpassword',
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000
    },
    port: '3306',
    seederStorage: 'sequelize',
    username: 'doutorjadbuser'
  },
  'test:local': {
    database: 'v2_doutorjadb_cartoes_development',
    dialect: 'mysql',
    host: '127.0.0.1',
    operatorsAliases: false,
    password: 'doutorjadbpassword',
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000
    },
    port: '3307',
    seederStorage: 'sequelize',
    username: 'doutorjadbuser'
  },
  'test:remote': {
    database: 'v2_doutorjadb_cartoes_test_remote',
    dialect: 'mysql',
    host: 'doutorja-db-homologacao.cs4jwe9f2whd.us-east-1.rds.amazonaws.com',
    operatorsAliases: false,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000
    },
    seederStorage: 'sequelize',
    username: process.env.DB_USER
  },
  'production:latest': {
    database: 'v2_doutorjadb_hml',
    dialect: 'mysql',
    host: 'doutorja-db-homologacao-mysql8.cs4jwe9f2whd.us-east-1.rds.amazonaws.com',
    logging: false,
    operatorsAliases: false,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000
    },
    seederStorage: 'sequelize',
    username: process.env.DB_USER
  },
  'production:stable': {
    database: 'v2_doutorjadb_hml',
    dialect: 'mysql',
    host: 'doutorja-db-production-mysql8.cs4jwe9f2whd.us-east-1.rds.amazonaws.com',
    logging: false,
    operatorsAliases: false,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000
    },
    seederStorage: 'sequelize',
    username: process.env.DB_USER
  },
  homolog: {
    database: process.env.DB_NAME,
    dialect: 'mysql',
    host: process.env.DB_HOST,
    logging: false,
    operatorsAliases: false,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000
    },
    seederStorage: 'sequelize',
    username: process.env.DB_USER
  }
};
