module.exports = {
  apps: [
    {
      name: "starrudder",
      script: "server.js",
      cwd: "/var/www/starrudder",
      // standalone 产物不会自动读取 .env.local，交给 Node 运行时加载
      node_args: "--env-file=.env.local",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        HOSTNAME: "127.0.0.1",
      },
      max_memory_restart: "512M",
      error_file: "/var/log/starrudder/error.log",
      out_file: "/var/log/starrudder/out.log",
    },
  ],
};
