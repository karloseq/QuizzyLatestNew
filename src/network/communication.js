import { formControlUnstyledClasses } from '@mui/base';
import Cookies from 'universal-cookie';

export const SECURITY_COOKIE = ".QUIZZYSECURITY"

function getIndexesInAlphabet(chars) {
    const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
  
    return chars.split('').map(function(char, i) {
      var index = ALPHABET.indexOf(char.toLowerCase());
      if (index < 0) {
        throw new Error(char + 'is not a valid alphabetic character.');
      }
      return index + 1;
    });
  }

export function get_tag_color_index(tag) {
    return getIndexesInAlphabet(tag.charAt(0))[0] % 12;
}

export function post_to_server(name, body, fn) {
    var token = localStorage.getItem("session_token");
    var ignoreToken = {
        "logout": true
    }
    if (!ignoreToken[name] && (!token || token == "")) {
        console.log("ERROR: post_to_server did not receive token")
        return false;
    }
    
    if (!body) {
        body = { };
    }

    var bodyToSend = {...body};
    bodyToSend.token = token;

    fetch("https://quizzynow.com/php/" + name + ".php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyToSend)
    }).then(function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
            return;
        }
        response.json().then(function(data) {
            fn(data);
        })
    })
}


export function fetch_transaction(transaction_id, fn) {
    fetch("https://quizzynow.com/php/payments/fetch_transaction.php?transaction_id=" + transaction_id + "&auth_cookie=" + get_session_token(), {
        method: 'GET',
    }).then(function(response) {
    response.json().then(function(data) {
        fn(data);
    })})
}

export function switch_membership(new_plan_id, fn){
    fetch("https://quizzynow.com/php/payments/upgrade_subscription.php?new_plan_id=" + new_plan_id + "&auth_cookie=" + get_session_token(), {
        method: 'GET',
    }).then(function(response) {
    response.json().then(function(data) {
        fn(data);
    })})
}

export function enter_payment_portal() {
    fetch_transaction("https://quizzynow.com/php/payments/enter_customer_portal.php?auth_cookie=" + get_session_token(), { 
        method: 'GET',
    }).then(function(response) {
    response.json().then(function(data) {
    })})
}

export function fetch_articles(section, fn) {
    fetch("https://quizzynow.com/php/fetch_articles.php?section=" + section, {
        method: 'GET'
    }).then(function(response) {
    response.json().then(function(data) {
        fn(data)
    })})
}

export function fetch_article(section, id, fn) {
    fetch("https://quizzynow.com/php/fetch_article.php?section=" + section + "&id=" + id, {
        method: 'GET'
    }).then(function(response) {
    response.json().then(function(data) {
        fn(data)
    })})
}

export function update_recall_session(setid, recall_data, fn) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("set_id", setid);
    for (const [key, value] of Object.entries(recall_data)) {
        formData.append("recall_info_keys[]", key)
        formData.append("recall_info_values[]", value)
    }
    return fetch("https://quizzynow.com/php/update_recall_session.php", {
        method: 'POST',
        body: formData,
    }).then(function(data) {
        fn(data)
    })
}

export function publish_article(title, content, section, sub_section, fn) {
    var formData = new FormData()
    formData.append("title", title);
    formData.append("auth_cookie", get_session_token());
    formData.append("content", content);
    formData.append("section", section);
    formData.append("sub-section", sub_section);
    return fetch("https://quizzynow.com/php/create_article.php", {
        method: 'POST',
        body: formData,
    }).then(function(data) {
        fn(data)
    })
}

export function add_task(task_type, sets, times, terms, fn) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("task_type", task_type);
    
    sets.forEach((sd) => {
        formData.append("sets[]", sd['id']);
    }) 
    times.forEach((ts) => {
        formData.append("dates[]", ts);
    })
    terms.forEach((termData, index) => {
        if (termData == "unlearned" || termData == "all") {
            formData.append("terms" + index, termData)
        }
        else {
            termData.forEach((selected) => {
                formData.append("terms_custom_" + index + "[]", selected)
            })
        }
    })
    return fetch("https://quizzynow.com/php/add-task.php", {
        method: 'POST',
        body: formData,
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
    })
}

export function update_recall_settings(setid, settings, fn) {
    var formData = new FormData()
    formData.append("setid", setid);
    formData.append("auth_cookie", get_session_token());
    formData.append("often_value", settings.often_value);
    formData.append("audio_enabled", settings.audio_enabled);
    formData.append("image_enabled", settings.image_enabled);
    formData.append("smart_completion", settings.smart_completion);
    formData.append("email_notifications", settings.email_notifications);
    return fetch("https://quizzynow.com/php/update_recall_settings.php", {
        method: 'POST',
        body: formData,
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
    })
}
export function get_recall_info(setid, fn) {
    fetch("https://quizzynow.com/php/get_recall_info.php?setid=" + setid + "&session_token=" + get_session_token(), {
        method: 'GET'
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
    })
}

export function get_recall_intervals(setid, fn) {
    fetch("https://quizzynow.com/php/get_recall_interval.php?setid=" + setid + "&session_token=" + get_session_token(), {
        method: 'GET'
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
    })
}

export function submit_recall_choice(setid, choice, fn) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("choice", choice);
    formData.append("setid", setid)
    return fetch("https://quizzynow.com/php/submit_recall_choice.php", {
        method: 'POST',
        body: formData,
    }).then(function(data) {
        fn(data)
    })
}

export function get_recall_queue(setid, fn) {
    fetch("https://quizzynow.com/php/get_recall_queue.php?setid=" + setid + "&session_token=" + get_session_token(), {
        method: 'GET'
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
    })
}

export function get_quiz_info(setid, fn) { // should return the latest quiz 
    fetch("https://quizzynow.com/php/get_quiz_info.php?setid=" + setid + "&session_token=" + get_session_token(), {
        method: 'GET'
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
    })
}

export function get_quiz_details(setid, fn) {
    fetch("https://quizzynow.com/php/get_quiz_details.php?setid=" + setid + "&session_token=" + get_session_token(), {
        method: 'GET'
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
    })
}

export function retake_quiz(setid, fn) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("setid", setid);

    return fetch("https://quizzynow.com/php/retake_quiz.php", {
        method: 'POST',
        body: formData,
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
       
    })
}

export function submit_quiz_answer(setid, section, question, answer, fn) {
    var formData = new FormData()
    formData.append("session_token", get_session_token());
    formData.append("setid", setid);
    formData.append("section", section);
    formData.append("question", question);
    formData.append("answer", answer);

    return fetch("https://quizzynow.com/php/update_quiz.php", {
        method: 'POST',
        body: formData,
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
       
    })
}

export function fetch_quiz_info(setid, assoc_id, fn) {
    fetch("https://quizzynow.com/php/fetch_quiz_info.php?setid=" + setid + "&session_token=" + get_session_token() + "&assoc_id=" + assoc_id, {
        method: 'GET'
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
    })
}

export function submit_quiz(setid, fn) {
    var formData = new FormData()
    formData.append("session_token", get_session_token());
    formData.append("setid", setid);
    return fetch("https://quizzynow.com/php/submit_quiz.php", {
        method: 'POST',
        body: formData,
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
       
    })
}

export function create_practice_exam(setid, audio, answer_with, types_of_questions, types_of_terms, images, n_questions, time, email_results, fn) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("setid", setid);
    formData.append("answer_with", answer_with)
    formData.append("audio", audio)
    formData.append("types_of_terms", types_of_terms)
    formData.append("n_questions", n_questions)
    formData.append("time", time)
    formData.append("email_results", email_results)
    formData.append("images", images)
    types_of_questions.forEach((data) => {
        formData.append("types_of_questions[]", data);
    }) 
    return fetch("https://quizzynow.com/php/create-quiz.php", {
        method: 'POST',
        body: formData,
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
    })
}

export function overwrite_quiz_answers(setid, quizQueue, fn) {
    var formData = new FormData()
    formData.append("session_token", get_session_token());
    formData.append("setid", setid);
    for (var section_index = 0; section_index < quizQueue.length; section_index++) { //i represents the index of the section
        for (var question_index = 0; question_index < quizQueue[section_index].length; question_index++) {
            var ans = quizQueue[section_index][question_index].answer;
            if (ans === "") {
                ans = null; 
            }
            if (ans != undefined && ans != null && (Array.isArray(ans) || typeof ans === 'object')) { // matching
                Object.keys(ans).forEach(function(choice) {
                    var ans_index = ans[choice]; 
                    if (choice != "undefined" && choice != undefined && ans_index != undefined && ans_index != "undefined") {
                        formData.append("answers_matching_keys[]", choice);
                        formData.append("answers_matching_values[]", ans_index);
                    }
                })
            }
            else { 
                formData.append("answers[]", ans);
            }
            
        }
    }
    return fetch("https://quizzynow.com/php/overwrite_quiz_answers.php", {
        method: 'POST',
        body: formData,
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
       
    })
}

export function update_status(status) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("action", "update-status");
    formData.append("status", status)
    return fetch("https://quizzynow.com/php/update_user.php", {
        method: 'POST',
        body: formData,
    }).then(function(data) {
    })
}

export function update_description(desc, fn) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("action", "update-description");
    formData.append("description", desc)
    return fetch("https://quizzynow.com/php/update_user.php", {
        method: 'POST',
        body: formData,
    }).then(function(data) {
        fn(data)
    })
}

export function update_favorite_subjects(subjects) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("action", "update-favorite-subjects");
    subjects.map((t, index) => {
        formData.append("subjects[]", t)
    })
   
    return fetch("https://quizzynow.com/php/update_user.php", {
        method: 'POST',
        body: formData,
    }).then(function(data) {

    })
}


export function get_session_token() {
    return localStorage.getItem("session_token");
}

export function view_user_info(userid, fn) {
    fetch("https://quizzynow.com/php/get-user-info.php?userid=" + userid + "&token=" + get_session_token(), {
        method: 'GET',
    }).then(function(response) {
    response.json().then(function(data) {
      fn(data)
    })})
}

export function get_article_suggestions(query, fn) {
    fetch("https://quizzynow.com/php/get_article_suggestions.php?query=" + query, {
        method: 'GET',
    }).then(function(response) {
    response.json().then(function(data) {
      fn(data)
    })})
}

export function search(query, fn, urlSearchParams) {
    if (!urlSearchParams.has("mastery")) {
        urlSearchParams.set("mastery", 0)
    }
    if (!urlSearchParams.has("views")) {
        urlSearchParams.set("views", 0)
    }
    if (!urlSearchParams.has("terms")) {
        urlSearchParams.set("terms", 0)
    }
    fetch("https://quizzynow.com/php/search.php?query=" + query + "&token=" + get_session_token() + "&" + urlSearchParams.toString(), {
        method: 'GET',
    }).then(function(response) {
    response.json().then(function(data) {
        console.log(data)
      fn(data)
    })})
}
export function add_friend(userid, fn) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("userid", userid)
    return fetch("https://quizzynow.com/php/add-friend.php", {
        method: 'POST',
        body: formData,
        //credentials: "include"
    }).then(function(data) {
        fn(data)
    })
}

export function revoke_friend_request(userid, fn) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("userid", userid)
    return fetch("https://quizzynow.com/php/revoke-friend-request.php", {
        method: 'POST',
        body: formData,
    }).then(function(data) {
        fn(data)
    })
}

export function remove_friend(userid, fn) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("userid", userid)
    return fetch("https://quizzynow.com/php/remove-friend.php", {
        method: 'POST',
        body: formData,
    }).then(function(data) {
        fn(data)
    })
}

export function accept_friend_request(userid, fn) {
    var formData = new FormData()
    formData.append("auth_cookie", get_session_token());
    formData.append("userid", userid)
    return fetch("https://quizzynow.com/php/accept-friend-request.php", {
        method: 'POST',
        body: formData,
    }).then(function(res) {
        res.json().then(function(data) {
            fn(data)
        })
    })
}

export function forgot_password(email, fn) {
    return fetch("https://quizzynow.com/php/forgot_password.php?email=" + email, {
        method: 'GET',
        
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
    })
}

export function reset_password(session, new_password="", fn) {
    return fetch("https://quizzynow.com/php/reset_password.php?session=" + session + "&new_password=" + new_password, {
        method: 'GET',
        
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data)
        })
    })
}

export function get_user(fn) {
    var token = localStorage.getItem("session_token");
    if ((!token || token == "")) {
        console.log("ERROR: did not receive token")
        fn({success: false})
    }
    var bodyToSend = {};
    bodyToSend.token = token;

     fetch("https://quizzynow.com/php/get-account.php", {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyToSend)
    }).then(function(resp) {
        resp.json().then(function(data) {
            fn(data);
        })
    }) 
}

export function update_schedule(fn) {
    fetch("https://quizzynow.com/php/update_schedule.php?token=" + get_session_token(), {
        method: 'GET'
    }).then(function(response) {
        response.json().then(function(data) {
            fn(data);
        })})
}

export function upload_image(name, formData, fn) {
    formData.append("auth_cookie", localStorage.getItem("session_token"))
    fetch("https://quizzynow.com/php/" + name + ".php", {
        method: 'POST',
        body: formData,
        //credentials: "include"
    }).then(function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
            return;
        }
      //  console.log(response.text())
        response.json().then(function(data) {
            fn(data);
        })
    })
}

export function get_set_data(setid, token, fn, category="flashcards") {
    fetch("https://quizzynow.com/php/view_study_set.php?setid=" + setid + "&request_cookie=" + token + "&category=" + category, {
        method: 'GET',
    }).then(function(response) {
    //    console.log(response.text())
    response.json().then(function(data) {
      fn(data)
    })})
}

export function on_set_closed(setid, studyMethod, token, fn) {
    const formData = new FormData();
    /*formData.append("setid", setid);
    formData.append("study_method", studyMethod);
    formData.append("request_cookie", token);*/
    fetch("https://quizzynow.com/php/close_study_set.php?setid=" + setid + "&request_cookie=" + token + "&study_method=" + studyMethod, {
        method: 'GET'
    }).then(function(response) {
        response.json().then(function(data) {
            console.log(data)
            fn(data)
        })})
}

export function update_set(setid, token, revisionType, revision,  fn) {
   
    /*fetch("https://quizzynow.com/php/edit_study_set.php?setid=" + setid + "&request_cookie=" + token + "&revision_type=" + revisionType + "&revision=" + revision, {
        method: 'GET',
    }).then(function(response) {
    response.json().then(function(data) {
     console.log(data);
     fn()
    })})*/

    const formData = new FormData();
    formData.append("setid", setid);
    formData.append("request_cookie", token);
    formData.append("revision_type", revisionType)
    formData.append("revision", revision);
    return fetch("https://quizzynow.com/php/edit_study_set.php", {
        method: 'POST',
        body: formData,
        //credentials: "include"
    })

}

export function on_logout() {
    const cookies = new Cookies();
    cookies.remove(SECURITY_COOKIE)
}

export function create_set(token, title, description, terms, visibility, copy_perms, tags, previewImageData) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("visibility", visibility);
    formData.append("auth_cookie", get_session_token())
    formData.append("copy_rights", copy_perms);

    tags.map((t, index) => {
        formData.append("tags[]", t)
    })
    terms.map((t, index) => {
        formData.append("termsf[]", t[0])
        formData.append("termsb[]", t[1])
        formData.append("termsf_eq[]", t[2] ?? "")
        formData.append("termsb_eq[]", t[3] ?? "")
    })

    description = encodeURIComponent(description)
    
    previewImageData.map((t, index) => {
        if (t[0]) {
            formData.append(index + "f", t[0])
        }
        if (t[1]) {
            formData.append(index + "b", t[1])
        }
    })
    return fetch("https://quizzynow.com/php/create_study_set.php", {
        method: 'POST',
        body: formData,
        //credentials: "include"
    })
}

export function edit_set(token, setid, title, description, terms, visibility, copy_perms, tags, previewImageData) {
    const formData = new FormData();
    formData.append("setid", setid);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("visibility", visibility);
    formData.append("request_cookie", get_session_token())
    formData.append("copy_rights", copy_perms);
    console.log(terms);
    tags.map((t, index) => {
        formData.append("tags[]", t)
    })
    var td = {...terms} //[1]: [front, back, front_img, back_img, front_equation, back_equation]
    terms.forEach(function(element, index) {
        if (element[2]) {
            td[index][2] = element[2].replace("https://quizzynow.com/uploads/card_images/", "")
        }
        if (element[3]) {
            td[index][3] = element[3].replace("https://quizzynow.com/uploads/card_images/", "")
        }
    });
    terms.map((t, index) => {
        formData.append("termsf[]", t[0])
        formData.append("termsb[]", t[1])
        formData.append("imagesf[]", t[2] ?? "")
        formData.append("imagesb[]", t[3] ?? "")
        formData.append("termsf_eq[]", t[4] ?? "")
        formData.append("termsb_eq[]", t[5] ?? "")
    })
    description = encodeURIComponent(description)
    console.log(previewImageData);
    previewImageData.map((t, index) => {
        if (t !== undefined) { 
            if (t[0]) {
                formData.append(index + "f", t[0])
            }
            if (t[1]) {
                formData.append(index + "b", t[1])
            }
        }
        
    })

    formData.append("revision_type", "all")
    
    return fetch("https://quizzynow.com/php/edit_study_set.php", {
        method: 'POST',
        body: formData,
        //credentials: "include"
    })
}

export function create_set_from_combine(title, description, visibility, copy_perms, tags, combine_data) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("visibility", visibility);
    formData.append("copy_rights", copy_perms);
    formData.append("auth_cookie", localStorage.getItem("session_token"))
    formData.append("create_type", "combine")
    //formData.append("combine_data", combine_data)
    combine_data.map((t, index) => {
        formData.append("combine_data[]", combine_data)
    })
    tags.map((t, index) => {
        formData.append("tags[]", t)
    })

    description = encodeURIComponent(description)
    
    return fetch("https://quizzynow.com/php/create_study_set.php", {
        method: 'POST',
        body: formData,
        //credentials: "include"
    })
}