const language_list = require('./../models/core/languages_list.m')
const language_elements = require('./../models/core/language_elements.m')

var i18n_json = async function (req) {

    if (!req.cookies || !req.cookies._LANGUAGE_) {
        return false;
    }

    try {
        let lang = req.cookies._LANGUAGE_;
        let lang_ = await language_list.findOne({lang_code: lang});
        if (!lang_) {
            lang_ = await language_list.findOne({lang_code: 'en_US'});
        }

        let elements = await language_elements.find({language: lang_});

        let i18n = {}
        elements.map((item, i) => {
            i18n[item.element_ref] = item.element_text;
        });

        return i18n;

    } catch (e) {
        return false;
    }


}

module.exports = {i18n_json};