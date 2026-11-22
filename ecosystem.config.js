module.exports = {
  apps: [
    {
      name: "starrudder",
      script: "server.js",
      cwd: "/var/www/starrudder",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      max_memory_restart: "512M",
      error_file: "/var/log/starrudder/error.log",
      out_file: "/var/log/starrudder/out.log",
    },
  ],
};
