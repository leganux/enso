let dotenv = require('dotenv');
const result = dotenv.config()

if (result.error) {
    throw result.error
}


var environment = {
    /******
     *  In which environment is deployed this project
     *  => production, develepment, qa
     * */
    environment: process.env.ENVIRONMENT,
    /******
     *  If SSL is actived or not
     *  => true, false
     * */
    active_ssl: eval(process.env.ACTIVE_SSL),

    /******
     *  If Body Parser is actived or not
     *  => true, false
     * */
    active_body_parser: eval(process.env.ACTIVE_BODY_PARSER),

    /******
     *  If file upload is actived or not
     *  => true, false
     * */
    active_file_upload: eval(process.env.ACTIVE_FILE_UPLOAD),

    /******
     *  Path where private key is located
     *  => String:PATH
     * */
    ssl_private_key: process.env.SSL_PRIVATE_KEY,

    /******
     *  Path where private cert is located
     *  => String:PATH
     * */
    ssl_cert: process.env.SSL_PRIVATE_CERTIFICATE,

    /******
     *  Path where private CA is located
     *  => String:PATH
     * */
    ssl_ca: process.env.SSL_PRIVATE_CA,

    /******
     *  Max size
     *  => Number:Max filesize  in mb
     * */
    max_fileupload_size: process.env.MAX_FILEUPLOAD_SIZE,

    /******
     *  config wich view engines is configured to  rednder html
     *  => String: default pug
     * */
    view_engine: process.env.VIEW_ENGINE,

    /******
     *  config wich kind of session will use
     *  => String: redis, standalone
     * */
    session_server: process.env.SESSION_SERVER,

    /******
     *  password for cookie
     *  => String: a dificult pass
     * */
    cookie_secret: process.env.COOKIE_SECRET,

    /******
     *  name for cookie store session
     *  => String: a namoe for cookie
     * */
    cookie_name: process.env.COOKIE_NAME,

    /******
     *  only set cookie form http server no in client
     *  => Boolean: true,false
     * */
    http_only: process.env.COOKIE_HTTP_ONLY,

    /******
     *  host for redis server
     *  => String : 127.0.0.1
     * */
    redis_host: process.env.REDIS_HOST,

    /******
     *  port for redis server
     *  => Number : 6739
     * */
    redis_port: Number(process.env.REDIS_PORT),

    /******
     *  number of database will use redis
     *  => Number : 1
     * */
    redis_no_db: Number(process.env.REDIS_NO_DB),

    /******
     *  allow user cors protetion headers
     *  => Bool : true, false
     * */
    active_cors: eval(process.env.ACTIVE_CORS),

    /******
     *  allow user cors credentials
     *  => Bool : true, false
     * */
    allow_credentials: eval(process.env.CORS_ALLOW_CREDENTIALS),

    /******
     *  port when server is not in https
     *  => Number : 80
     * */
    no_ssl_port: Number(process.env.NO_SSL_PORT),

    /******
     *  port when server is  in https
     *  => Number : 443
     * */
    ssl_port: Number(process.env.SSL_PORT),

    /******
     *  allow user cors protetion headers
     *  => String : * or domain 127.0.0.1
     * */
    cors_domain: process.env.CORS_DOMAIN,

    /******
     *  Subdirectory url root
     *  => String : / or /something/
     * */
    root_path: process.env.ROOT_URL_PATH,

    /******
     *  if soket io is actived or not
     *  => Boolean : true or false
     * */
    active_socket: eval(process.env.ACTIVE_SOCKET_),

    /******
     *  baseurl for wsocket
     *  => Boolean : true or false
     * */
    socket_path: (process.env.SOCKET_PATH),

    /******
     *  name of log file
     *  => String : app.log
     * */
    log_name: (process.env.LOG_FILE_NAME),

    /******
     *  suburl for  admin panel
     *  => String : can chage to hide
     * */
    control_panel_url: (process.env.ADMIN_SUB_URL_PATH),
}


module.exports = {environment};

