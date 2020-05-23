let env = require('./environment.config').environment;
rp = env.root_path + 'content/cdn/';

let cdn = {
    cdn_path: rp,
    website: [],
    admin_panel: {
        dashboard: {
            styles: [
                rp + 'adminlte3/css/adminlte.min.css',
                rp + 'fontawesome-free/css/all.min.css',
                rp + 'adminlte3/css/adminlte.min.css',
            ],
            scripts: [
                rp + 'jquery/jquery.min.js',
                rp + 'bootstrap/js/bootstrap.bundle.min.js',
                rp + 'adminlte3/js/adminlte.min.js',
                rp + 'adminlte3/js/demo.js',
            ]
        },
        login: {
            styles: [
                rp + 'fontawesome-free/css/all.min.css',
                rp + 'icheck-bootstrap/icheck-bootstrap.min.css',
                rp + 'adminlte3/css/adminlte.min.css',

            ],
            scripts: [
                rp + 'jquery/jquery.min.js',
                rp + 'bootstrap/js/bootstrap.bundle.min.js',
                rp + 'adminlte3/js/adminlte.min.js',
            ]
        }
    }
}


module.exports = cdn;