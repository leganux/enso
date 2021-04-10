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
                rp + 'sweetalert2-theme-bootstrap-4/bootstrap-4.min.css',
                rp + 'daterangepicker/daterangepicker.css',
                rp + 'icheck-bootstrap/icheck-bootstrap.min.css',
                rp + 'bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
                rp + 'tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
                rp + 'select2/css/select2.min.css',
                rp + 'select2-bootstrap4-theme/select2-bootstrap4.min.css',
                rp + 'summernote/summernote-bs4.css',
                rp + 'datatables-bs4/css/dataTables.bootstrap4.min.css',
                rp + 'datatables-responsive/css/responsive.bootstrap4.min.css',
                rp + 'holdon/holdOn.css',
                rp + 'animate/animate.css',
                rp + 'jquery_upload/jquery_upload.css',
                rp + 'codemirror/lib/codemirror.css',
                rp + 'codemirror/theme/dracula.css',
            ],
            scripts: [
                rp + 'jquery/jquery.min.js',
                rp + 'bootstrap/js/bootstrap.bundle.min.js',
                rp + 'adminlte3/js/adminlte.min.js',
                rp + 'adminlte3/js/demo.js',
                rp + 'sweetalert2/sweetalert2.min.js',
                rp + 'select2/js/select2.full.min.js',
                rp + 'moment/moment.min.js',
                rp + 'inputmask/min/jquery.inputmask.bundle.min.js',
                rp + 'daterangepicker/daterangepicker.js',
                rp + 'bootstrap-colorpicker/js/bootstrap-colorpicker.min.js',
                rp + 'tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js',
                rp + 'bootstrap-switch/js/bootstrap-switch.min.js',
                rp + 'popper/umd/popper.min.js',
                rp + 'summernote/summernote-bs4.js',
                rp + 'datatables/jquery.dataTables.min.js',
                rp + 'datatables-bs4/js/dataTables.bootstrap4.min.js',
                rp + 'datatables-responsive/js/dataTables.responsive.min.js',
                rp + 'datatables-responsive/js/responsive.bootstrap4.min.js',
                rp + 'voca/voca.js',
                rp + 'holdon/holdOn.js',
                rp + 'client/client.js',
                rp + 'jquery_upload/jquery_upload.js',
                rp + 'socket/socket.io.js',
                rp + 'codemirror/lib/codemirror.js',
                rp + 'codemirror/mode/javascript/javascript.js',
                rp + 'codemirror/addon/selection/active-line.js',
                rp + 'codemirror/addon/edit/matchbrackets.js',
                rp + 'codemirror/lib/util/formatting.js',

            ]
        },
        login: {
            styles: [
                rp + 'fontawesome-free/css/all.min.css',
                rp + 'icheck-bootstrap/icheck-bootstrap.min.css',
                rp + 'adminlte3/css/adminlte.min.css',
                rp + 'animate/animate.css',
                rp + 'sweetalert2-theme-bootstrap-4/bootstrap-4.min.css',

            ],
            scripts: [
                rp + 'jquery/jquery.min.js',
                rp + 'bootstrap/js/bootstrap.bundle.min.js',
                rp + 'adminlte3/js/adminlte.min.js',
                rp + 'sweetalert2/sweetalert2.min.js',
            ]
        }
    }
}


module.exports = cdn;