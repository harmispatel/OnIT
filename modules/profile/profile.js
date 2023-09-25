//var SESSIONS_DATA = '';
var photo_editor;
CURRENT_PATH = '../../';
EMP_ID = '';
var btn_test_email, btn_save_mail;

$.fn.load_default_img = function ()
{
	$("#img_emp_photo").attr("src", SESSIONS_DATA.profile_img_url + "?" + new Date().getTime());

	// let get_param = { id: '', module_id: 81, method: "get_files", primary_id: SESSIONS_DATA.emp_id, secondary_id: 13, token: $.jStorage.get('token') };
	// $.fn.fetch_data(
	// 	$.fn.generate_parameter('get_files', get_param),
	// 	function (return_data_pp)
	// 	{
	// 		let profile_img = '';
	// 		if (return_data_pp.data.length > 0)
	// 		{
	// 			let data = return_data_pp.data[0];
	// 			if (data.thumbnailUrl)
	// 			{
	// 				profile_img = data.thumbnailUrl;
	// 			}
	// 			if (profile_img)
	// 			{
	// 				$("#img_emp_photo").attr("src", profile_img + "?" + new Date().getTime());
	// 			}
	// 			else
	// 			{
	// 				$("#img_emp_photo").attr("src", DEFAULT_PROFILE_PIC + "?" + new Date().getTime());
	// 			}
	// 		}
	// 		else
	// 		{
	// 			$("#img_emp_photo").attr("src", DEFAULT_PROFILE_PIC + "?" + new Date().getTime());
	// 		}

	// 	},
	// 	true
	// );

}

$.fn.populate_detail_form = function ()
{
	try
	{
		$('.populate').select2();
		var data =
		{
			id: SESSIONS_DATA.id
		};

		$('.populate').select2();
		$('#dd_mail_type').val("1").change();

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_users_list', { id: data.id, client_id: SESSIONS_DATA.client_id }),
				function (return_data)
				{
					if (return_data.data.list)
					{

						let data = return_data.data.list[0];
						// let data_asset = return_data.data.asset_list;

						EMP_ID = data.id;
						$('#div_name').html(data.name);
						// $('#div_employer').html(data.employer_name);

						// console.log(data);
						$('#div_reporting_to').html(data.reporting_to_name);

						$('#div_email').html(data.email);
						$('#div_dept').html(data.dept_name);

						// $('#div_nationality').html(data.nationality_descr);
						// $('#div_home_country').html(data.home_country_descr);

						// $('#div_start_date').html(data.work_start_date);
						// $('#div_end_date').html(data.work_end_date);
						// $('#div_notice_period').html(data.notice_period);
						// $('#div_ep_expiry_date').html(data.ep_valid_till);
						// $('#div_general_skills').html(data.general_skills_descr);
						// $('#div_specific_skills').html(data.specific_skills_descr);

						$('#div_desg').html(data.designation);
						$('#div_mobile').html(data.mobile_no);

						let json_field = $.fn.get_json_string(data.json_field);

						if (json_field !== false)
						{

							// $('#div_employee_no').html(json_field.employee_no);
							// $('#div_home_address').html(json_field.home_address);
							// $('#div_current_address').html(json_field.local_address);
							// $('#div_leaving_date').html(json_field.leaving_date);
							// $('#div_reason').html(json_field.leaving_reason);
							// $('#div_phone').html(json_field.home_phone);

							// data.is_active == 1 ? $('#div_active_status').html('<span class="text-success"><b>Active</b></span>') : $('#div_active_status').html('<span class="text-danger"><b>Inactive</b></span>');
							// data.is_active == 1 ? $('#leaving_div').hide() : $('#leaving_div').show();

							// $('#div_general_skills').attr('data-id', json_field.general_skills);
							// $('#div_specific_skills').attr('data-id', json_field.specific_skills);

							// if (json_field.mail)
							// {
							// 	$('#dd_mail_type').val(json_field.mail.type).change();
							// 	$('#txt_mail_outserver_name').val(json_field.mail.outserver_name);
							// 	$('#txt_mail_outserver_port').val(json_field.mail.outserver_port);
							// 	$('#txt_mail_inserver_name').val(json_field.mail.inserver_name);
							// 	$('#txt_mail_inserver_port').val(json_field.mail.inserver_port);
							// 	$('#txt_mail_username').val(json_field.mail.username);
							// 	$('#txt_mail_password').val(json_field.mail.password);
							// 	$('#txt_mail_from_name').val(json_field.mail.from_name);
							// 	$('#chk_mail_require_auth').prop('checked', parseInt(json_field.mail.required_auth) ? true : false);
							// }

						}

						// var row = '';
						// for (var i = 0; i < data_asset.length; i++)
						// {
						// 	row += '<tr>' +
						// 		'<td>' + data_asset[i].type_name + '</td>';
						// 	data_asset[i].owner_name != null ? row += '<td>' + data_asset[i].owner_name + '</td>' : row += '<td>MSP</td>';
						// 	data_asset[i].brand_name != null && data_asset[i].brand_name != '' ? row += '<td>' + data_asset[i].brand_name + '</td>' : row += '<td>-</td>';
						// 	data_asset[i].taken_date != null ? row += '<td>' + data_asset[i].taken_date + '</td>' : row += '<td>-</td>';
						// 	data_asset[i].return_date != null ? row += '<td>' + data_asset[i].return_date + '</td>' : row += '<td>-</td>';
						// 	row += '</tr>';

						// }
						// $('#tbl_asset tbody').html(row);

						// $.fn.populate_attachment_list_form(return_data.data.documents, 1);
						// $.fn.populate_attachment_list_form(return_data.data.exit_checklist, 2);
					}
				}, true
			);

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_attachment_list_form = function (data, type)
{
	try
	{
		if (type == 1)
		{
			$('#tbl_attachment').empty();
			if (data) // check if there is any data, precaution
			{
				var row = '';
				for (var i = 0; i < data.length; i++)
				{
					let json_field = $.fn.get_json_string(data[i].json_field);
					if (json_field !== false)
					{
						if (parseInt(json_field.is_visible) == 1)
						{
							row += `<tr data-value="${ escape(JSON.stringify(data[i])) }">
								<td><a class="tooltips" href="javascript:void(0)" onclick="$.fn.open_page('${ data[i].id }','${ CURRENT_PATH }download.php')"
									data-trigger="hover" data-original-title="View File "><i class="fa fa-picture-o"/></a></td>
								<td>${ json_field.category }</td>
								<td>${ data[i].filename }</td>
								<td>${ json_field.remarks }</td>
							</tr>`;
						}
					}
				}
				$('#tbl_attachment').append(row);
			}
		}
		else if (type == 2)
		{
			$('#tbl_exit').empty();
			if (data) // check if there is any data, precaution
			{
				var row = '';
				for (var i = 0; i < data.length; i++)
				{
					let json_field = $.fn.get_json_string(data[i].json_field);
					if (json_field)
					{
						if (parseInt(json_field.is_visible) == 1)
						{
							row += `<tr data-value="${ escape(JSON.stringify(data[i])) }">
									<td><a class="tooltips" href="javascript:void(0)" onclick="$.fn.open_page('${ data[i].id }','${ CURRENT_PATH }download.php')"
										data-trigger="hover" data-original-title="View File "><i class="fa fa-picture-o"/></a></td>
									<td>${ json_field.category }</td>
									<td>${ data[i].filename }</td>
									<td>${ json_field.remarks }</td>
								
								</tr>`;
						}

					}
				}
				$('#tbl_exit').append(row);
			}
		}
	}
	catch (err)
	{
		//		console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.get_profile_dropdown_data = function ()
{
	try
	{
		//  let lead_access = $.fn.get_accessibility(111); 
		let data =
		{
			emp_id: SESSIONS_DATA.emp_id,
		};

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_profile_dropdown_data', data),
				function (return_data)
				{
					if (return_data.code == 0)
					{
						$.fn.populate_dd_values('dd_general_skills', return_data.data);
						$.fn.populate_dd_values('dd_specific_skills', return_data.data);
					}
				}, true
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_dd_values = function (element_id, dd_data, is_search = false)
{
	try
	{
		$('#dd_general_skills').empty();
		if (dd_data.skills_general != null)
		{
			for (let item of dd_data.skills_general)
			{ $('#dd_general_skills').append(`<option  data-type="skills_general"  value="${ item.id }">${ item.skills_name } </option>`); }
			let data_str_general = JSON.stringify(dd_data.skills_general);
			$("div#edit_general_skills").attr("data-obj", data_str_general);

		}

		$('#dd_specific_skills').empty();
		if (dd_data.skills_specific != null)
		{
			for (let item of dd_data.skills_specific)
			{ $('#dd_specific_skills').append(`<option  data-type="skills_specific"  value="${ item.id }">${ item.skills_name } </option>`); }
			let data_str_specific = JSON.stringify(dd_data.skills_specific);
			$("div#edit_specific_skills").attr("data-obj", data_str_specific);

		}

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.view_file = function (data)
{
	try
	{
		if (data.filepath == '')
		{
			$.fn.show_right_error_noty('Document path cannot be empty');
			return;
		}

		window.open(data.filepath);
	}
	catch (err)
	{
		//		console.log(err.message);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.reset_upload_form = function ()
{
	$('#files').html('');
	var $fileupload = $('#fileupload');
	$fileupload.unbind('fileuploadadd');
};

$.fn.init_upload_file = function ()
{
	// $.fn.load_default_img();
	$.fn.reset_upload_form();

	var $fileupload = $('#fileupload');

	$fileupload.fileupload
		({
			url: CURRENT_PATH + upload_file_path,
			dataType: 'json',
			autoUpload: false,
			acceptFileTypes: /^image\/(jpe?g|png)$/i,
			maxFileSize: undefined,
			disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
			previewMaxWidth: 80,
			previewMaxHeight: 80,
			previewCrop: true,
		});


	$fileupload.bind('fileuploadsubmit', function (e, data)
	{
		data.formData =
		{
			upload_path: 'photos/' + EMP_ID + '/',
			file_name: EMP_ID + '.jpg',
			overwrite: true
		};
	});


	$fileupload.bind('fileuploadadd', function (e, data)
	{
		var $files = $('#files');
		$.each(data.files, function (index, file)
		{
			var reader = new FileReader();
			reader.onload = function (e)
			{
				$('#img_emp_photo').attr('src', e.target.result);
			};
			reader.readAsDataURL(file);
		});
	});
};

$.fn.send_test_email = function ()
{
	try
	{
		var data =
		{
			mail_type: $('#dd_mail_type').val(),
			outserver_name: $('#txt_mail_outserver_name').val(),
			outserver_port: $('#txt_mail_outserver_port').val(),
			username: $('#txt_mail_username').val(),
			password: $('#txt_mail_password').val(),
			from_name: $('#txt_mail_from_name').val(),
			require_auth: $('#chk_mail_require_auth').is(':checked') ? 1 : 0,
			emp_id: SESSIONS_DATA.emp_id
		}

		$.fn.write_data
			(
				$.fn.generate_parameter('send_emp_test_email', data),
				function (return_data)
				{
					if (return_data.data)
					{
						$.fn.show_right_success_noty('Email sent successfully');
						$('#btn_save_mail').removeAttr('disabled');
					}

				}, false, btn_test_email
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.save_mail = function ()
{
	try
	{
		var data =
		{
			id: EMP_ID,
			type: $('#dd_mail_type').val(),
			outserver_name: $('#txt_mail_outserver_name').val(),
			outserver_port: $('#txt_mail_outserver_port').val(),
			inserver_name: $('#txt_mail_inserver_name').val(),
			inserver_port: $('#txt_mail_inserver_port').val(),
			username: $('#txt_mail_username').val(),
			password: $('#txt_mail_password').val(),
			from_name: $('#txt_mail_from_name').val(),
			require_auth: $('#chk_mail_require_auth').is(':checked') ? 1 : 0,
			emp_id: SESSIONS_DATA.emp_id
		}

		$.fn.write_data
			(
				$.fn.generate_parameter('update_profile', data),
				function (return_data)
				{
					if (return_data.data)
					{
						$.fn.show_right_success_noty('Mail configuration saved successfully');
					}

				}, false, btn_save_mail
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.bind_command_events = function ()
{
	try
	{

		$('#btn_test_email').click(function (e)
		{
			e.preventDefault();
			btn_test_email = Ladda.create(this);
			btn_test_email.start();
			$.fn.send_test_email();
		});

		$('#btn_save_mail').click(function (e)
		{
			e.preventDefault();
			btn_save_mail = Ladda.create(this);
			btn_save_mail.start();
			$.fn.save_mail();
		});

		$('#btn_edit').on('click', function (ev) 
		{
			$('#btn_edit_photo,#btn_add_image').show();
		});

		$('#btn_edit_photo').click(function (e)
		{
			e.preventDefault();
			$('#btn_edit_done').show();
			$('#div_photo_container').removeClass('photo-container');
			$('#btn_edit_photo').hide();
			photo_editor = $('#img_emp_photo');
			photo_editor.croppie
				({
					viewport:
					{
						width: 150,
						height: 150,
						type: 'circle'
					},
					boundary:
					{
						width: 200,
						height: 200
					},
					// url: 'demo/demo-1.jpg',
					enforceBoundary: false
					// mouseWheelZoom: false
				});
		});

		$('.photo-container').hover(function ()
		{
			$('#btn_edit_photo').css("display", "flex");
		}, function ()
		{
			$('#btn_edit_photo').css("display", "none");
		});

		$('#btn_edit_done').on('click', function (ev)
		{
			photo_editor.croppie('result',
				{
					type: 'rawcanvas',
					size: { width: 300, height: 300 },
					format: 'png'
				}).then(function (canvas)
				{
					$.fn.fetch_data
						(
							$.fn.generate_parameter('edit_profile_pic', { image: canvas.toDataURL(), emp_id: SESSIONS_DATA.emp_id }),
							function (return_data)
							{
								photo_editor.croppie('destroy');
								$('#img_emp_photo').prependTo('#div_photo_container'); // NOTE: put it back where it belongs
								$('#div_photo_container div').remove(); 	// NOTE: and delete those pesky leftover divs

								$('#btn_edit_done').hide();
								$('#btn_edit_photo').show();
								$('#img_emp_photo').attr("src", return_data.data);
								$.fn.show_right_success_noty('Profile picture has been updated successfully');
							}
						);
				});
		});

		$('.btn-edit-details').on('click', function (ev)
		{
			//			console.log("button clicked - ", $(this).attr('id'));		//TODO: remove this later
			var id = $(this).attr('id');

			switch (id)
			{
				case 'btn_edit_email':
					$('#view_email').hide();
					$('#edit_email').show();

					var str = $('#div_email').text();
					$('#txt_email').val(str).focus();

					break;

				case 'btn_edit_chat':
					$('#view_chat').hide();
					$('#edit_chat').show();

					//					var str = JSON.parse($('#div_chat').attr('data'));
					//					console.log(str);
					//					$('#txt_chat_password').val(str.chat_password);
					//					$('#txt_chat').val($('#div_chat').html()).focus();

					break;

				case 'btn_edit_phone':
					$('#view_phone').hide();
					$('#edit_phone').show();

					var str = $('#div_phone').text();
					var str2 = $('#div_mobile').text();

					$('#txt_phone').val(str);
					$('#txt_mobile').val(str2);
					break;
				case 'btn_edit_home_address':
					$('#view_home_address').hide();
					$('#edit_home_address').show();

					var str = $('#div_home_address').text();
					$('#txt_home_address').val(str).focus();

					break;
				case 'btn_edit_current_address':
					$('#view_current_address').hide();
					$('#edit_current_address').show();

					var str = $('#div_current_address').text();
					$('#txt_current_address').val(str).focus();

					break;
				case 'btn_edit_general_skills':
					$('#view_general_skills').hide();
					$('#edit_general_skills').show();

					var str = $('#div_general_skills').attr('data-id');
					str ? $('#dd_general_skills').val(str.split(',')).change() : $('#dd_general_skills').val('').change();


					break;
				case 'btn_edit_specific_skills':
					$('#view_specific_skills').hide();
					$('#edit_specific_skills').show();

					//var str = $('#div_specific_skills').attr('data-id');
					//str ? $('#dd_specific_skills').val(str.split(', ')).change() : $('#dd_specific_skills').val('').change();
					var str = $('#div_specific_skills').attr('data-id');
					str ? $('#dd_specific_skills').val(str.split(',')).change() : $('#dd_specific_skills').val('').change();
					break;
			}
		});

		$('.btn-cancel-edit').on('click', function (ev)
		{

			let id = $(this).attr('id');

			switch (id)
			{
				case 'btn_cancel_email':
					$('#view_email').show();
					$('#edit_email').hide();
					break;

				case 'btn_cancel_chat':
					$('#view_chat').show();
					$('#edit_chat').hide();
					break;

				case 'btn_cancel_phone':
					$('#view_phone').show();
					$('#edit_phone').hide();
					break;

				case 'btn_cancel_home_address':
					$('#view_home_address').show();
					$('#edit_home_address').hide();
					break;

				case 'btn_cancel_current_address':
					$('#view_current_address').show();
					$('#edit_current_address').hide();
					break;

				case 'btn_cancel_general_skills':
					$('#view_general_skills').show();
					$('#edit_general_skills').hide();
					break;

				case 'btn_cancel_specific_skills':
					$('#view_specific_skills').show();
					$('#edit_specific_skills').hide();
					break;
			}

		});

		$('.btn-save-edit').on('click', function (ev)
		{
			let id = $(this).attr('id');

			switch (id) 
			{


				case 'btn_save_email':
					var data = {
						id: EMP_ID,
						emp_id: SESSIONS_DATA.emp_id,
						email: $('#txt_email').val()
					};
					$.fn.update_field(
						data,
						function ()
						{
							var str = $('#txt_email').val();
							$('#div_email').html(str);
							$('#view_email').show();
							$('#edit_email').hide();
						}
					);
					break;

				case 'btn_test_chat':
					$.fn.test_chat_login();
					break;

				case 'btn_save_chat':
					var data =
					{
						id: EMP_ID,
						emp_id: SESSIONS_DATA.emp_id,
						chat_id: $('#txt_chat').val(),
						chat_password: $('#txt_chat_password').val()

					};
					$.fn.update_field
						(
							data,
							function () 
							{
								$('#div_chat').html($('#txt_chat').val());
								$('#view_chat').show();
								$('#edit_chat').hide();
							}
						);
					break;
				case 'btn_save_phone':
					var data = {
						id: EMP_ID,
						emp_id: SESSIONS_DATA.emp_id,
						phone: $('#txt_phone').val(),
						mobile: $('#txt_mobile').val()
					};
					$.fn.update_field(
						data,
						function ()
						{
							var str = $('#txt_phone').val(),
								str2 = $('#txt_mobile').val();
							$('#div_phone').html(str);
							$('#div_mobile').html(str2);
							$('#view_phone').show();
							$('#edit_phone').hide();
						}
					);
					break;
				case 'btn_save_home_address':
					var data = {
						id: EMP_ID,
						emp_id: SESSIONS_DATA.emp_id,
						home_address: $('#txt_home_address').val()
					};
					$.fn.update_field(
						data,
						function ()
						{
							var str = $('#txt_home_address').val();
							$('#div_home_address').html(str.replace(/\r?\n/g, '<br/>'));

							$('#view_home_address').show();
							$('#edit_home_address').hide();
						}
					);
					break;
				case 'btn_save_current_address':
					var data = {
						id: EMP_ID,
						emp_id: SESSIONS_DATA.emp_id,
						current_address: $('#txt_current_address').val()
					};
					$.fn.update_field(
						data,
						function ()
						{
							var str = $('#txt_current_address').val();
							$('#div_current_address').html(str.replace(/\r?\n/g, '<br/>'));

							$('#view_current_address').show();
							$('#edit_current_address').hide();
						}
					);

					break;
				case 'btn_save_general_skills':
					console.log($('#dd_general_skills').val().toString());
					var data = {
						id: EMP_ID,
						emp_id: SESSIONS_DATA.emp_id,
						general_skills: $('#dd_general_skills').val().toString()
					};
					$.fn.update_field(
						data,
						function ()
						{
							$('#div_general_skills').html($.fn.convert_skills_view('general', $('#dd_general_skills').val()));

							$('#view_general_skills').show();
							$('#edit_general_skills').hide();
						}
					);

					break;
				case 'btn_save_specific_skills':

					var data = {
						id: EMP_ID,
						emp_id: SESSIONS_DATA.emp_id,
						specific_skills: $('#dd_specific_skills').val().toString()
					};

					$.fn.update_field(
						data,
						function ()
						{
							$('#div_specific_skills').html($.fn.convert_skills_view('specific', $('#dd_specific_skills').val()));

							$('#view_specific_skills').show();
							$('#edit_specific_skills').hide();
						}
					);

					break;
			}
		})
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.convert_skills_view = function (type, values) 
{
	try
	{
		let array = [], result = [];

		if (type == 'general')
		{
			array = JSON.parse($('#edit_general_skills').attr('data-obj'));

			values.forEach(function (item)
			{
				for (let i of array)
				{
					if (i.id == item)
					{
						result.push(i.skills_name);
						break;
					}
				}
			})
		}
		else if (type == 'specific')
		{
			array = JSON.parse($('#edit_specific_skills').attr('data-obj'));

			values.forEach(function (item)
			{
				for (let i of array)
				{
					if (i.id === item)
					{
						result.push(i.skills_name);
						break;
					}
				}
			})
		}

		return result.toString();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
}

// $.fn.test_chat_login = function () 
// {
// 	try 
// 	{
// 		let btn = Ladda.create($('#btn_test_chat')[0]);
// 		btn.start();

// 		let data =
// 		{
// 			emp_id: EMP_ID,
// 			user_id: $('#txt_chat').val(),
// 			user_password: $('#txt_chat_password').val()
// 		};

// 		$.fn.write_data
// 			(
// 				$.fn.generate_parameter('test_chat_login', data),
// 				function (return_data) 
// 				{
// 					if (return_data.data)
// 					{
// 						SESSIONS_DATA.chat_user_id = return_data.data.user_id;
// 						SESSIONS_DATA.chat_token = return_data.data.user_token;
// 						$.fn.show_right_success_noty('Test Success');
// 					}
// 				}, false, btn
// 			);
// 	}
// 	catch (err) 
// 	{
// 		console.log(err);
// 		// $.fn.log_error(arguments.callee.caller,err.message);
// 	}
// }

$.fn.update_field = function (objData, call_back) 
{
	try 
	{
		$.fn.write_data
			(
				$.fn.generate_parameter('update_profile', objData),
				function (return_data)
				{
					if (return_data.data)
					{
						call_back(return_data);
					}
				}
			);
	}
	catch (err)
	{
		console.log(err);
		// $.fn.log_error(arguments.callee.caller,err.message);
	}
}

$.fn.form_load = function ()
{
	try
	{
		//SESSIONS_DATA = JSON.parse($('#session_data').val());

		$('.populate').select2();
		// $.fn.get_profile_dropdown_data();
		$.fn.load_default_img();
		$.fn.populate_detail_form();
		$.fn.bind_command_events();
		$.fn.init_upload_file();

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

// START of Document initialization
$(document).ready(function ()
{
	$.fn.form_load();

});
// END of Document initialization
