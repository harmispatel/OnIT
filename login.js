/**
 * @author 		Jamal
 * @date 		9-Apr-2012
 * @modify 		12-Jun-2012
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 * 		   Please re-read this again
 */

if (!window.location.origin)
	window.location.origin = window.location.protocol + '//' + window.location.host;

var directory_path = appConfig.DIRECTORY_PATH;
// var services_URL = window.location.origin + `${ directory_path }services/services.php`;
var services_URL = window.location.origin + `${ directory_path }public/api.php`;
var redirect_mainpage = window.location.origin + `${ directory_path }public/dashboard/user`;
var CURRENT_PATH = '';
var loading_image = "<img src='" + CURRENT_PATH + "./assets/js/custom/busy.gif'/>";
var BLOCKUI_CSS = { border: 'none', padding: '15px', backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: .5, color: '#fff' };
var loading_text = " Just a moment...";

$.fn.set_session_values = function (param) 
{
	$.jStorage.set('token', param.token);
	$.jStorage.set('app_name', "ONIT");
	$.jStorage.set('session_data', param);
};

$.fn.log_error = function (routine_name, error_msg)
{
	Ladda.stopAll();
	$.unblockUI();
	alert('Error Occur at : ' + routine_name + ' with error msg : ' + error_msg, $.jStorage.get('app_name'));
};

$.fn.is_success = function (code)
{
	if (code == '0')
		return true;
	else
		return false;

};

$.fn.is_session_active = function ()
{
	if ($.jStorage.get('username') == null)
		window.location.href = 'login.html';
};

$.fn.clear_active_session = function ()
{
	$.removeData(document.body, "scheme");
	$.jStorage.flush();
};

$.fn.do_login_new = function (is_otp = false)
{
	try
	{
		let pass = $.trim($('#txt_password').val());
		var param =
		{
			username: $.trim($('#txt_username').val()),
			password: pass,
			method: 'web_login',
			otp: is_otp ? $('#txt_otp').val() : '',
		};
		$.ajax
			({
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(param),
				url: services_URL,
				success: function (data)
				{
					if ($.fn.is_success(data.code) == false)
						alert(data.msg);
					else
					{

						let r_data = data.data;
						if (r_data.otp == 'generated')
						{
							$('.loginBlock').hide();
							$('.otpBlock').show();
							return false;
						}
						else if (r_data.otp == 'fail')
						{
							alert('OTP is invalid');
							return false;
						}
						else
						{
							var session_info =
							{
								token: r_data.token,
								emp_id: r_data.emp_id,
								office_email: r_data.office_email,
								name: r_data.name,
								is_admin: r_data.is_admin,
								super_admin: r_data.super_admin,
								access: r_data.access,
								modules: r_data.modules,
								cpanel_domain: r_data.CPANEL_DOMAIN,
								logo_path: r_data.logo_path,
								profile_pic_path: r_data.profile_pic_path,
								company_id: r_data.company_id,
								salt: r_data.salt,
								pbkdf2_rounds: r_data.pbkdf2_rounds,
								rnd: r_data.rnd,
							};

							// if (r_data.user_type == 1)
							// {
							// 	alert('You are not authorized to login.');
							// 	return false;
							// }
							// else
							// {
							$.fn.set_session_values(session_info);
							window.location.href = redirect_mainpage;
							// }
						}
					}
				},
				error: function (err)
				{
          console.log(err,services_URL);

					// alert('Resource is not available. One or more of the services on which we depend is unavailable. Please try again later after the service has had a chance to recover.');
				},
				beforeSend: function ()
				{
					$.blockUI({ message: '<span class="loader_text">' + loading_image + loading_text + '</span>' });
				},
				complete: function ()
				{
					$.unblockUI();
				}
			});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.do_login = function ()
{
	try
	{
		let param =
		{
			username: $.trim($('#txt_username').val()),
			password: $.trim($('#txt_password').val()),
			method: 'web_login'
		};
    console.log(services_URL)
		$.ajax
			({
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(param),
				url: services_URL,
				success: function (data)
				{
					if ($.fn.is_success(data.code) == false)
					{
						Swal.fire
							({
								title: "Error",
								text: data.msg,
								icon: "error"
							})
					}
					else
					{
						$.fn.set_session_values(data.data);
						window.location.href = redirect_mainpage;
					}
				},
				error: function (err)
				{
          console.log(err)
					alert('Resource is not available. One or more of the services on which we depend is unavailable. Please try again later after the service has had a chance to recover.');
				},
				beforeSend: function ()
				{
					$.blockUI({ message: '<span class="loader_text">' + loading_image + loading_text + '</span>' });
				},
				complete: function ()
				{
					$.unblockUI();
				}
			});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$(document).ready(function () 
{
	$.fn.clear_active_session();
	$('.loginBlock').show();
	$('.otpBlock').hide();

	$('#btn_login').click(function ()
	{
		$.fn.do_login();
	});

	// $('#btn_otp_submit').click(function ()
	// {
	// 	$.fn.do_login(true);
	// });

	$('#txt_username').keydown(function (e) 
	{
		if (e.which == 13)
		{
			$.fn.do_login();
		}
	});
	$('#txt_password').keydown(function (e) 
	{
		if (e.which == 13)
		{
			$.fn.do_login();
		}
	});

});