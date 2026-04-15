module.exports = {
    apps: [
        {
            name: "symflowbuilder",
            script: "node_modules/.bin/next",
            args: "start -p 3003",
            cwd: "/var/www/symflowbuilder",
            env: {
                NODE_ENV: "production",
            },
            instances: 1,
            autorestart: true,
            max_restarts: 10,
            restart_delay: 5000,
            max_memory_restart: "512M",
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
            error_file: "/var/www/symflowbuilder/logs/error.log",
            out_file: "/var/www/symflowbuilder/logs/out.log",
            merge_logs: true,
        },
    ],
};
