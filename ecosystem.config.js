module.exports = {
  apps : [{
    name: 'API_DEV',
    script: 'server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : '140.82.31.130',
      ref  : 'origin/develop',
      repo : 'https://github.com/plazari15/Receitas-de-Vo.git',
      path : '/var/www/Receitas-de-Vo',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js'
    }
  }
};
