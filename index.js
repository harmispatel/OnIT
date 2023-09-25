/**
 * @author Jamal
 * @date 9-Apr-2012
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 */

var upload_section = '';
var btn_update_pass;
var DEFAULT_PROFILE_PIC = "assets/custom/users/default.jpg";

$(window).on('beforeunload', function ()
{
	// Temporary disable
	// $.fn.signout_application();
	// $.fn.user_logout();	
});

$('#changepassm').click(function ()
{
	$('#change_pwd_modal').modal('show');
});

$.fn.set_validation_form = function ()
{
	$('#change_pwd_form').parsley(
		{
			classHandler: function (parsleyField)
			{
				return parsleyField.$element.closest(".errorContainer");
			},
			errorsContainer: function (parsleyField)
			{
				return parsleyField.$element.closest(".errorContainer");
			},
		}
	);

}

$.fn.load_default_img = function ()
{
	$('#profile-pic').on("error", function ()
	{
		// $('#profile-pic').attr("src", appConfig.DIRECTORY_PATH + DEFAULT_PROFILE_PIC);
	});

}

$.fn.toggle_reveal = function (btn, node_id)
{
	try 
	{
		var type = $('#' + node_id).attr('type');

		if (type == 'text')
		{
			$('#' + node_id).attr('type', 'password');
			btn.innerText = 'show';
		}
		else if (type == 'password')
		{
			$('#' + node_id).attr('type', 'text');
			btn.innerText = 'hide';
		}
	}
	catch (e) 
	{
		$.fn.log_error(arguments.callee.caller, e.message);
	}
}

$.fn.logoff_progress = function ()
{
	var percent = 0;
	var notice = $.toast(
		{
			heading: "SUCCESS",
			text: "Please wait we complete the progress",
			position: "top-right",
			loaderBg: "#43a8bf",
			icon: "success",
			bgColor: "#4fc6e1"

		});

	setTimeout(function () 
	{
		$.toast(
			{
				heading: "",

			});
		var interval = setInterval(function () 
		{
			percent += 2;
			var options =
			{
				text: percent + "% complete."
			};
			if (percent == 80) options.title = "Almost There";
			if (percent >= 100) 
			{
				window.clearInterval(interval);
				options.title = "Done!";
				options.type = "success";
				options.hide = true;
				options.closer = true;
				options.sticker = true;
				options.icon = 'fa fa-check';
				options.opacity = 1;
				options.shadow = true;
				//options.width = $.toast.defaults.width;
				window.location = appConfig.BASE_URL + "login.html";
			}
			$.toast(options);
		}, 60);
	}, 1000);
}

$(document).ready(function () 
{
	try
	{

		// console.log($.jStorage.get('session_data'));
		let SESSIONS_DATA = $.jStorage.get('session_data');
		$("#new_chat_msgs").hide();
		if (SESSIONS_DATA)
		{
			//set current user display name
			$('#users_name,#left_users_name').html(`${ $.jStorage.get('session_data').name } <i class="mdi mdi-chevron-down"></i> `);

			//set profile pic

			$('#profile_pic').on("error", function ()
			{
				// $('#profile_pic,#left_profile_pic').attr("src", appConfig.DIRECTORY_PATH + "assets/img/profile-default.jpg");
			});

			//navigation access

			//User Dashboard
			let user_dashboard = $('#mn_user_dashboard').attr('href');
			let user_dashboard_access = $.fn.get_accessibility($.fn.get_page_name(user_dashboard));
			if (user_dashboard_access == 0 || user_dashboard_access.view == 0)
			{
				$('#user_dash_li').hide();
			}


			let projects = $('#mn_projects').attr('href');
			let projects_access = $.fn.get_accessibility($.fn.get_page_name(projects));
			if (projects_access == 0 || projects_access.view == 0)
			{
				$('#projects_li').hide();
			}

			let users = $('#mn_people').attr('href');
			let users_access = $.fn.get_accessibility($.fn.get_page_name(users));
			if (users_access == 0 || users_access.view == 0)
			{
				$('#people_li').hide();
			}

			let attendance = $('#mn_attendance').attr('href');
			let attendance_access = $.fn.get_accessibility($.fn.get_page_name(attendance));
			if (attendance_access == 0 || attendance_access.view == 0)
			{
				$('#attendance_li').hide();
			}

			let leaves = $('#mn_leave').attr('href');
			let leaves_access = $.fn.get_accessibility($.fn.get_page_name(leaves));
			if (leaves_access == 0 || leaves_access.view == 0)
			{
				$('#leave_li').hide();
			}

			let customer = $('#mn_customer').attr('href');
			let customer_access = $.fn.get_accessibility($.fn.get_page_name(customer));
			if (customer_access == 0 || customer_access.view == 0)
			{
				$('#customer_li').hide();
			}


			//Utilities
			let configuration = $('#mn_configuration').attr('href');
			let configuration_access = $.fn.get_accessibility($.fn.get_page_name(configuration));
			if (configuration_access == 0 || configuration_access.view == 0)
			{
				$('#utilities_li').hide();
			}

			//admindashboard
			if (SESSIONS_DATA.is_admin == 0)
			{
				$('#admin_dash_li').hide();
				$('#admin_user_dash_li').hide();
			}

			$('#sidebar-menu').show();

			// Initial Navigo
			var root = appConfig.ROOT_PATH;
			var useHash = true; // Defaults to: false
			var hash = '#!'; // Defaults to: '#'
			var router = new Navigo(root, false);

			router.hooks({
				before(done)
				{
					$('#sidebar-menu .menuitem-active').removeClass('menuitem-active');
					$('#sidebar-menu .collapse').removeClass('show');
					done();
				},
				after(match)
				{
					let el = $(`[href="${ match.url }"]`);
					let p_li = el.parent().closest('li');

					//add active class to parent li
					p_li.addClass('menuitem-active');
					if (p_li.parents('div.collapse').length > 0)
					{
						p_li.parents('div.collapse').addClass('show');
					}
				},
				already: function ()
				{
					window.location.reload();
				}
			});

			const middleware = (done, match) =>
			{
				let route_url = match.url;

				//get module access based on route url
				let module_access = $.fn.get_accessibility($.fn.get_page_name(route_url));

				MODULE_ACCESS = module_access;

				//if user can't view redirect to login page
				if (module_access == 0 || module_access.view == 0)
				{
					done(false);

					window.location.href = root + 'login.html';
				}

				// console.log("herer");

				done(true); //if have access - proceed

			};

			const namedMiddleware = (done, match) =>
			{
				let route_name = match.route.name;

				//get module access based on route url
				let module_access = $.fn.get_accessibility($.fn.get_page_name(route_name));
				MODULE_ACCESS = module_access;

				//if user can't view redirect to login page
				if (module_access == 0 || module_access.view == 0)
				{
					done(false);
					window.location.href = root + 'login.html';
				}

				done(true); //if have access - proceed
			};

			router

				/*.on("/", () => { 
					if(SESSIONS_DATA.is_admin==1){
					$.fn.load_form('./modules/dashboard/admin_dash.html');
					}else
					{$.fn.load_form('./modules/dashboard/user_dash.html');}
				}, { before: middleware })*/

				.on("/dashboard/admin", () =>
				{
					$.fn.load_form('./modules/dashboard/admin_dash.html');
				}, { before: middleware })
				.on("/dashboard/user", () =>
				{
					$.fn.load_form('./modules/dashboard/user_dash.html');
				}, { before: middleware })
				.on("/profile", () =>
				{
					$.fn.load_form('./modules/profile/profile.html');
				}, { before: middleware })

				.on("/signout", () =>
				{
					$.fn.user_logout();
				})
				.on("/operation/users", () =>
				{
					$.fn.load_form('./modules/users/users.html');
				}, { before: middleware })

				.on("/operation/attendance", () =>
				{
					$.fn.load_form('./modules/attendance/list.html');
				}, { before: middleware })
				.on("/attendance_reports", () =>
				{
					$.fn.load_form('./modules/attendance/list_new.html');
				}, { before: middleware })
				.on("/attendance/reports", () =>
				{
					$.fn.load_form('./modules/attendance/reports.html');
				}, { before: middleware })
				.on("/attendance/reports_images", () =>
				{
					$.fn.load_form('./modules/attendance/reports_images.html');
				}, { before: middleware })
				.on("/attendance/reports_summary", () =>
				{
					$.fn.load_form('./modules/attendance/reports_summary.html');
				}, { before: middleware })
				.on("/customer/list", () =>
				{
					$.fn.load_form('./modules/customer/customer.html');
				}, { before: middleware })
				.on("/projects/projects_list", () =>
				{
					$.fn.load_form('./modules/projects/project_list.html');
				}, { before: middleware })


				.on("/leaves/leaves", () =>
				{
					$.fn.load_form('./modules/leave/leave.html')
				}, { before: middleware })
				.on("/leaves/approval", () =>
				{
					$.fn.load_form('./modules/leave/leave_info.html')
				}, { before: middleware })
				.on("/leave/report", () =>
				{
					$.fn.load_form('./modules/leave/leave_report.html')
				}, { before: middleware })

				.on("/settings/configuration", () =>
				{
					$.fn.load_form('./modules/settings/configuration.html');
				}, { before: middleware })

				.notFound(() =>
				{ // not found route - display 404 page
					console.log('404');
				})
				.resolve();

			//store router in a global variable
			ROUTE = router;

			//store current route in a global variable
			CURRENT_ROUTE = router.current[0];

			$("#profile_pic").attr("src", SESSIONS_DATA.profile_img_url + "?" + new Date().getTime());


			/** FOOTER CHANGE PASSWORD  */
			$('pwd-policy-txt_new_pwd').css('display:none');
			$.fn.password_check('txt_new_pwd');

			$.fn.set_validation_form();


			$('#change_pwd_form').parsley
				({
					successClass: 'has-success',
					errorClass: 'has-error',
					errors:
					{
						classHandler: function (ele)
						{
							return $(ele).closest('.form-group');
						},
						errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
						errorElem: '<li></li>'
					}
				});

			$('#change_pwd_modal').on('show.bs.modal', function (e)
			{
				var button = $(e.relatedTarget);
				var initial_pswd = button.data('initial');

				$('#btn_update_pwd').data('initial', initial_pswd);

				if (initial_pswd == true)
				{
					$('#btn_cancel_pwd_change').hide();
				}
				else if (initial_pswd == false)
				{
					$('#btn_cancel_pwd_change').show();
				}
			});

			$('#btn_update_pwd').on('click', function (e)
			{
				e.preventDefault();
				btn_update_pass = Ladda.create(this);
				btn_update_pass.start();

				if ($('#change_pwd_form').parsley().validate() == false)
				{
					btn_update_pass.stop();
					return;
				}
				else
				{
					var initial_pswd = $(this).data('initial');
					var old_pwd = $('#txt_current_pwd').val();
					var new_pwd = $('#txt_new_pwd').val();
					var confirm_pwd = $('#txt_confirm_pwd').val();

					var data =
					{
						emp_id: SESSIONS_DATA.emp_id,
						old_pwd: old_pwd,
						new_pwd: new_pwd,
						email: SESSIONS_DATA.office_email,
						chat_user_id: SESSIONS_DATA.chat_user_id
					}

					if (confirm_pwd !== new_pwd)
					{
						// TODO: Throw error password not Matched
						/* $.pnotify
							 ({
								 title: 'Error',
								 type: 'error',
								 text: `Password not matched`
							 });*/
						$.fn.show_right_error_noty('Password not matched');
						return;
					}
					else
					{
						(
							$.fn.fetch_data
								(
									$.fn.generate_parameter('change_password', data),
									function (return_data)
									{
										$('#div_response').empty();
										if (return_data.code == 1)
										{
											console.error("[ERROR] Failed to change password", return_data);
										}
										else
										{
											//             let class_name = "alert alert-dismissable alert-success col-md-12";
											//             let title = "<strong>Well done!</strong> Portal password successfully updated.";

											//             if (return_data.data.portal != 1)
											//             {
											//                 class_name = "alert alert-dismissable alert-danger col-md-12";
											//                 title = "<strong>Oh snap!</strong> Updating Portal password Failed, contact Administrator."
											//             }
											//             $('#div_response').append
											//                 (`<div class="${class_name}">${title}
											// 	<button type="button" style="float:right;font-size:x-small;" class="bootbox-close-button close"  data-bs-dismiss="alert" aria-label="Close">&times;</button>
											// </div>`);


											//             class_name = "alert alert-dismissable alert-success col-md-12";
											//             title = "<strong>Well done!</strong> Email password successfully updated.";
											//             if (return_data.data.email != 1)
											//             {
											//                 class_name = "alert alert-dismissable alert-danger col-md-12";
											//                 title = "<strong>Oh snap!</strong> Updating Email password Failed, contact Administrator."
											//             }
											//             $('#div_response').append
											//                 (`<div class="${class_name}">${title}
											// 	<button type="button" style="float:right;font-size:x-small;" class="bootbox-close-button close"  data-bs-dismiss="alert" aria-label="Close">&times;</button>
											// </div>`);


											//             class_name = "alert alert-dismissable alert-success col-md-12";
											//             title = "<strong>Well done!</strong> Chat password successfully updated";
											//             if (return_data.data.chat != 1)
											//             {
											//                 class_name = "alert alert-dismissable alert-danger col-md-12";
											//                 title = "<strong>Oh snap!</strong> Updating Chat password Failed, contact Administrator."
											//             }
											//             $('#div_response').append
											//                 (`<div class="${class_name}">${title}
											// 	<button type="button" style="float:right;font-size:x-small;" class="bootbox-close-button close"  data-bs-dismiss="alert" aria-label="Close">&times;</button>
											// </div>`);

											$('#div_footer').hide();
											$.fn.logoff_progress();
										}
									}, false, btn_update_pass
								)
						)
					}
				}
			});

			if (SESSIONS_DATA.initial_pswd == 1)
			{
				$('#change_pwd_modal').modal
					({
						backdrop: 'static',
						keyboard: false
					});

				$('#btn_cancel_pwd_change').hide();
			}

		}
		else
		{
			var root = appConfig.ROOT_PATH;
			window.location.href = root + 'login.html';
		}
	}
	catch (err)
	{
		console.log(err);
		$.fn.log_error(arguments.callee.caller, err.message);
	}

	$('#chat_page').on('click', function (e) 
	{
		e.preventDefault();
		window.location.href = "chats";
	});

});

function top_leave_notification()
{

	let data =
	{
		emp_id: SESSIONS_DATA.emp_id
	};

	$.fn.write_data
		(
			$.fn.generate_parameter('top_leave_notification', data),
			function (return_data)
			{

				if (return_data.data)  // NOTE: Success
				{
					let data = return_data.data;

					if (data.remark_count)
					{
						$(".noti-icon-badge.viewed").html(data.remark_count);

					}
					else
					{
						$(".noti-icon-badge.viewed").html(0);
					}
				}
				else
				{
					$(".noti-icon-badge.viewed").html(0);
				}
			}, false, false
		);
}

function top_notification()
{

	let data =
	{
		emp_id: SESSIONS_DATA.emp_id
	};

	var call_noti_audio = 0;
	$.fn.write_data
		(
			$.fn.generate_parameter('top_notification', data),
			function (return_data)
			{

				if (return_data.data)  // NOTE: Success
				{
					let data = return_data.data;

					if (data.chat_check == 1)
					{
						if (!$('#new_chat_msgs').is(':visible'))
						{
							call_noti_audio = 1;
						}
						$("#new_chat_msgs").show();
					}
					else if (data.chat_check == 0)
					{
						$("#new_chat_msgs").hide();
					}

					/*  if(call_noti_audio==1){
						  notification_call();
					  }*/

				}
				else
				{
					$(".noti-icon-badge.tasks").html(0);
					$(".noti-icon-badge.comments").html(0);
				}
			}, false, false
		);
}

setInterval(function ()
{

	//top_notification();

}, 3000);