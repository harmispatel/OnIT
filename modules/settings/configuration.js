/**
 * @author Jamal
 * @date 01-Oct-2021
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 */
var RECORD_INDEX = 0;
var btn_save, flatpickr = '';
var ROW_ID = '';
var SESSIONS_DATA = $.jStorage.get('session_data');

$.fn.data_table_features = function (data)
{
	try
	{
		if (data.id == 30 || data.id == 2 || data.id == 32 || data.id == 61 || data.id == 62 || data.id == 67)
		{
			var aoColumns = [
				{ sWidth: '10%' },
				{ sWidth: '30%' },
				{ sWidth: '20%' },
				{ sWidth: '20%' },
				{ sWidth: '20%' },
			];
		}
		else
		{
			var aoColumns = [
				{ sWidth: '10%' },
				{ sWidth: '30%' },
				{ sWidth: '20%' },
				{ sWidth: '20%' },
			];
		}
		if (!$.fn.dataTable.isDataTable('#master_list'))
		{
			table = $('#master_list').DataTable
				({
					bAutoWidth: false,
					aoColumns: aoColumns,
					"searching": false,
					"paging": false,
					"info": false,
					"sorting": true,
					"order": []
				});
		}

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.data_table_destroy = function ()
{
	try
	{

		if ($.fn.dataTable.isDataTable('#master_list'))
		{
			$('#master_list').DataTable().destroy();
		}

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.remove_company_logo = function ()
{
	try 
	{
		bootbox.confirm
			({
				title: "Delete Confirmation",
				message: "Are you sure want to delete this logo",
				buttons:
				{
					cancel:
					{
						label: '<i class="fa fa-times"></i> Cancel'
					},
					confirm:
					{
						label: '<i class="fa fa-check"></i> Yes'
					}
				},
				callback: function (result)
				{
					if (result == true)
					{
						let data =
						{
							company_id: $('#employer_id').val()
						}
						$.fn.fetch_data
							(
								$.fn.generate_parameter('remove_company_logo', data),
								function (return_data)
								{
									if (return_data.code == 0)
									{
										$.fn.init_crop();
										$('.gambar').attr('src', return_data.data);
										$('#btn_remove_logo').hide();
										$.fn.show_right_success_noty('Logo has been deleted successfully');
									}
								}, true
							);
					}
				}
			});

	}
	catch (e) 
	{
		$.fn.log_error(arguments.callee.caller, e.message);
	}
}

$.fn.populate_uploaded_holiday = function (data)
{
	try 
	{
		$('#tbl_upload_body').empty();
		if (data.length > 0) // check if there is any data, precaution
		{
			let row = '';
			let status_icon = '';
			for (var i = 0; i < data.length; i++)
			{
				status_icon = '<i class="fa fa-check-circle text-warning"></i>';

				if (data[i].status == false)
				{
					status_icon = '<i class="fa fa-times-circle text-danger"></i>';
				}
				if (data[i].result > 0)
				{
					status_icon = '<i class="fa fa-check-circle text-success"></i>';
				}

				row += `<tr class="timesheet" data-value='${ encode(JSON.stringify(data[i])) }'>
			                <td>${ status_icon }</td>
			                <td><span style="white-space: nowrap;">${ data[i].date }</span></td>
			                <td>${ data[i].descr }</td>
			                <td>${ data[i].active_name }</td>          
			            </tr>`;
			}
			$('#tbl_upload_body').append(row);
		}
		$('#upload_modal').modal('show');
	}
	catch (e) 
	{
		$.fn.log_error(arguments.callee.caller, e.message);
	}
}

$.fn.show_div = function (data)
{
	$('#div_noOfDays').hide();
	$('#div_roles').hide();
	$('#div_sla').hide();
	$('#div_dependent').hide();
	$('#div_tasks').hide();
	$('#nod_head').hide();
	$('#additional_head').hide();
	$('#div_onboarding').hide();

	$('.desc-label').html('Description');

	$('#btn_save').removeAttr('disabled');

	if (data.value == 16)
	{
		$('#div_noOfDays').show();
		$('#nod_head').show();
	}
	else if (data.value == 30)
	{
		$('#div_roles').show();
		$('#div_sla').show();
		$('#additional_head').html('Route To');
		$('#additional_head').show();
	}
	else if (data.value == 2)
	{

		$('#div_roles').show();
		$('#additional_head').html('Route To');
		$('#additional_head').show();
	}
	else if (data.value == 32)
	{
		$('#div_dependent').show();
		$('#additional_head').html('Amount');
		$('#additional_head').show();
	}
	else if (data.value == 61 || data.value == 62)
	{
		$('#div_tasks').show();
		$('#additional_head').html('Is Chargeable?');
		$('#additional_head').show();

		$('.desc-label').html('Job Item');
	}
	else if (data.value == 67)
	{
		$('#div_onboarding').show();
		$('#additional_head').html('Cost');
		$('#additional_head').show();
		$('#btn_save').attr('disabled', 'disabled');
	}
	$("#dd_category").val(data.value);
	$.fn.get_list(data.value, reload = false);

};

$.fn.reset_form = function (form)
{
	try
	{
		ROW_ID = '';
		$('#txt_desc').val('');
		$('#txt_onboarding_cost').val('');

		if (form == true)
		{
			$('#txt_onboarding_cost').val('');
			$('#div_roles').hide();
			$('#div_dependent').hide();
			$('#div_onboarding').hide();
			$('#div_tasks').hide();
			$('#div_noOfDays').hide();
			$('#chk_is_active').prop('checked', false);
			$('#chk_is_chargeable').prop('checked', false);
		}
		if (form == 'holiday')
		{
			$('#dp_hp').val('');
			//$("#dd_company")	.val(1).change();
			flatpickr.clear();
			$('#txt_hp_desc').val('');
			$('#chk_hp_is_active').prop('checked', false);
			$('#btn_hp_save').html('<i class="mdi mdi-content-save-outline"></i>&nbsp;Save');
		}
		$('#txt_no_of_days').val('');
		$('#dd_roles').val('').change();
		$('#txt_sla').val('');
		$('#txt_kpi').val('');
		$('#txt_6_months').val('');
		$('#txt_7_months').val('');
		$('#btn_save').html('<i class="mdi mdi-content-save-outline"></i>&nbsp;Save');
		$('#div_noOfDays').hide();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.get_list = function (id, reload = true)
{
	try
	{
		var data =
		{
			id: id,
			client_id: SESSIONS_DATA.client_id
		};
		$('#detail_form').parsley().destroy();
		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_misc', data),
				function (return_data)
				{
					if (return_data)
					{
						$.fn.data_table_destroy();
						$.fn.populate_list_form(return_data.data);
						$.fn.data_table_features(data);

						if (reload == true)
						{
							var categoryArray = [];
							$(return_data.data).each(function (index, value)
							{
								var temp = {};
								temp.id = value.category_id;
								temp.name = value.category;
								categoryArray.push(temp);
							});
							let uniqueObjArray = [...new Map(categoryArray.map((item) => [item["id"], item])).values()];
							$.fn.populate_category_dropdown(uniqueObjArray);
						}
					}
				}, true
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_list_form = function (data, is_scroll)
{
	try
	{
		if (data) // check if there is any data, precaution 
		{

			$('#master_list > tbody').empty();
			var row = '';
			var data_val = '';

			for (var i = 0; i < data.length; i++)
			{
				data_val = encodeURIComponent(JSON.stringify(data[i])); //.replace(/'/,"");

				row += `<tr>
							<td><a class="tooltips" href="javascript:void(0)" data-value=${ data_val } onclick="$.fn.populate_detail_form(decodeURIComponent($(this).attr(\'data-value\')))" data-trigger="hover" data-original-title="Edit data "><i class="mdi mdi-lead-pencil text-primary"></i></a></td>
							<td>${ data[i].descr }</td>
							<td>${ data[i].category }</td>`;

				if (data[i].category_id == 16)
				{
					row += `<td>${ data[i].no_of_days }</td>`;
				}

				if (data[i].category_id == 2 || data[i].category_id == 30)
				{
					row += `<td>${ data[i].roles }</td>`;
				}
				else if (data[i].category_id == 32)
				{
					row += `<td>${ '6 Month and Less : ' + data[i].field1 + '<br>' + 'More than 6 Months : ' + data[i].field2 }</td>`;
				}
				else if (data[i].category_id == 61 || data[i].category_id == 62)
				{
					row += `<td>${ data[i].field1 == 1 ? 'Yes' : 'No' }</td>`;
				}
				else if (data[i].category_id == 67)
				{
					row += `<td>${ data[i].field1 }</td>`;
				}

				row += `<td>${ data[i].status }</td>
				</tr>`;

			}
			$('#master_list tbody').append(row);
		}

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.save_edit_form = function ()
{
	try
	{
		if ($('#detail_form').parsley().validate() == false)
		{
			btn_save.stop();
			return;
		}

		var cat_id = $('#dd_category').val();

		var noOfDays = null;
		if (cat_id == 16)
		{
			noOfDays = $('#txt_no_of_days').val();
		}

		let field1, field2, field3 = '0';
		if (cat_id == 30)
		{
			if ($('#dd_roles').val() != '' && $('#dd_roles').val() != null)
			{
				field1 = $('#dd_roles').val().toString();
			}

			field2 = $('#txt_sla').val();
			field3 = $('#txt_kpi').val();
		}
		else if (cat_id == 32)
		{
			field1 = $('#txt_6_months').val();
			field2 = $('#txt_7_months').val();
			field3 = 0;
		}
		if (cat_id == 2)
		{
			if ($('#dd_roles').val() != '' && $('#dd_roles').val() != null)
			{
				field1 = $('#dd_roles').val().toString();
			}
		}
		if (cat_id == 61 || cat_id == 62)
		{
			field1 = $("#chk_is_chargeable").is(":checked") ? 1 : 0;
		}
		if (cat_id == 67)
		{
			field1 = $("#txt_onboarding_cost").val();
		}

		var data =
		{
			id: ROW_ID,
			descr: $('#txt_desc').val(),
			category_id: cat_id,
			is_active: $('#chk_is_active').is(':checked') ? 1 : 0,
			user_id: SESSIONS_DATA.id,
			client_id: SESSIONS_DATA.client_id
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('add_edit_misc', data),
				function (return_data)
				{
					if (return_data.code == 1)
					{
						btn_save.stop();
						return;
					}
					if (return_data.data)
					{
						$.fn.populate_list_form(return_data.data);
						$.fn.data_table_features(return_data.data);
						$.fn.show_right_success_noty('Data has been recorded successfully');

						$.fn.reset_form(false);

						btn_save.remove();
						$("#btn_save").removeClass("ladda-button");
						if (cat_id == 67)
						{
							$('#btn_save').attr('disabled', 'disabled');

						}

					}

				}, false, false
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.set_edit_form = function (data)
{
	$('#btn_save').html('<i class="fa fa-edit"></i> Edit');
};

$.fn.populate_detail_form = function (data)
{
	try
	{
		var data = JSON.parse(data);
		ROW_ID = data.id;
		$('#txt_desc').val(data.descr);
		$('#dd_category').val(data.category_id).change();
		$('#chk_is_active').prop('checked', parseInt(data.is_active) ? true : false);
		$('#txt_no_of_days').val('');
		$('#dd_roles').val('').change();
		$('#txt_sla,#txt_kpi').val('');
		if (data.is_active == 1)
			$('#chk_is_active').prop('checked', true);
		else
			$('#chk_is_active').prop('checked', false);
		if (data.category_id == 16)
			$('#txt_no_of_days').val(data.no_of_days);
		else if (data.category_id == 30)
		{
			$('#dd_roles').val(JSON.parse("[" + data.field1 + "]")).change();
			$('#txt_sla').val(data.field2);
			$('#txt_kpi').val(data.field3);
		}
		else if (data.category_id == 32)
		{
			$('#txt_6_months').val(data.field1);
			$('#txt_7_months').val(data.field2);
		}
		else if (data.category_id == 2)
			$('#dd_roles').val(JSON.parse("[" + data.field1 + "]")).change();
		else if (data.category_id == 61 || data.category_id == 62)
			$('#chk_is_chargeable').prop('checked', parseInt(data.field1) ? true : false);
		else if (data.category_id == 67)
		{
			$('#txt_onboarding_cost').val(data.field1);
			$('#btn_save').removeAttr('disabled');
		}
		$('#btn_save').html('<i class="fa fa-check"></i> Update');
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_employers_list = function (data)
{
	try
	{
		if (data)
		{
			$('#tbl_view_list > tbody').empty();
			var row = '';
			var data_val = '';
			let btn_edit = '';
			for (var i = 0; i < data.length; i++)
			{
				data_val = escape(JSON.stringify(data[i]));
				btn_edit = `<a class="tooltips" href="javascript:void(0)" onclick="$.fn.populate_employer_details(decodeURIComponent( $(this).closest('tr').attr('data-value')  ))" data-trigger="hover" data-original-title="Edit data "><i class="mdi mdi-lead-pencil text-primary"></i></a>`;
				row += `<tr data-value=${ data_val } ID=${ 'tr_row_' + i }">
							<td>${ btn_edit }</td>
							<td>${ data[i].employer_name }</td>
							<td>${ data[i].prefix }</td>
							<td>${ data[i].is_active_desc }</td>
							<td>${ data[i].created_date }</td>
						</tr>`;
			}
			$('#tbl_view_list > tbody').html(row);
			$('.back-to-top-badge').removeClass('back-to-top-badge-visible');
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.get_employers_list = function ()
{
	try
	{
		// var data = { client_id: SESSIONS_DATA.client_id };
		// $.fn.fetch_data
		// 	(
		// 		$.fn.generate_parameter('get_customer_dropdown', data),
		// 		function (return_data)
		// 		{
		// 			if (return_data)
		// 			{

		// 				// $.fn.populate_employers_list(return_data.data);
		// 				$.fn.populate_employers_drop_down(return_data.data.customer);
		// 				$.fn.populate_year_drop_down();
		// 			}
		// 		}, true
		// 	);
	}
	catch (err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.get_employees_list = function ()
{
	try
	{
		var data = {};
		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_employee_list', data),
				function (return_data)
				{
					if (return_data)
					{

						$.fn.populate_employees_list(return_data.data);
					}
				}, true
			);
	}
	catch (err)
	{
		console.log(err.message);
		//$.fn.log_error(arguments.callee.caller,err.message);
	}
};

$.fn.populate_employees_list = function (data)
{
	try
	{
		if (data)
		{
			var row = '';
			for (var i = 0; i < data.length; i++)
			{
				row += `<option value=${ data[i].id }>${ data[i].desc }</option>`;
			}
			$('#dd_roles').html(row);
			$('#dd_roles').val(data[0].id);

			if ($('#dd_roles').val() != null)
				$('#dd_roles').trigger('change');
		}
		$("#dd_roles").select2();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_employers_drop_down = function (data)
{
	try
	{
		if (data)
		{
			var row = '';
			for (var i = 0; i < data.length; i++)
			{
				row += `<option value=${ data[i].id }>${ data[i].descr }</option>`;
			}
			$('#dd_company').html(row);
			$('#dd_company').val(data[0].id);

			if ($('#dd_year').val() != null)
				$('#dd_company').trigger('change');
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_year_drop_down = function ()
{
	try
	{
		let to_year = (new Date().getFullYear() + 2);
		let from_year = (new Date().getFullYear() + 2) - 4;
		var row = '';
		for (var i = to_year; i >= from_year; i--)
		{
			row += `<option value=${ i }>${ i }</option>`;
		}
		$('#dd_year').html(row);
		$('#dd_year').val(new Date().getFullYear());
		$('#dd_year').trigger('change');
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_holiday_list = function (data)
{
	try
	{
		if (data) // check if there is any data, precaution 
		{
			$('#hp_list > tbody').empty();
			var row = '';
			var data_val = '';
			for (var i = 0; i < data.length; i++)
			{
				data_val = encode(JSON.stringify(data[i]));
				date = data[i].holiday;
				// date = moment(date, SERVER_DATE_FORMAT);
				// date = date.format('DD/MM/YYYY');
				row += `<tr>
							<td><a class="tooltips" href="javascript:void(0)" data-value="${ data_val }" onclick="$.fn.populate_hp_detail(decode( $(this).attr('data-value')  ))" data-trigger="hover" data-original-title="Edit data "><i class="mdi mdi-lead-pencil text-primary"></i></a></td>
							<td>${ date }</td>
							<td>${ data[i].holiday_desc }</td>
							<td>${ data[i].is_active == 1 ? 'ACTIVE' : 'INACTIVE' }</td>
						</tr>`;
			}

			$('#hp_list tbody').append(row);
			$('#total_holidays').html(data.length);
		}



	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.get_holidays_list = function (id)
{
	try
	{
		let data =
		{
			year: $('#dd_year').val(),
			client_id: SESSIONS_DATA.client_id
		};
		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_holidays_list', data),
				function (return_data)
				{

					if (return_data.data)
					{
						$.fn.populate_holiday_list(return_data.data);
					}
				}, true
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.show_hide_form = function (form_status)
{
	if (form_status == 'NEW')
	{
		$("#messages-b2").removeClass("active");
		$('#new_div').show(400);
		$("#div_cd").addClass("active");
		$('#h4_primary_no').text('New Employer');
	}
	else if (form_status == 'EDIT')
	{
		$("#messages-b2").removeClass("active");
		$('#new_div').show(400);
		$("#div_cd").addClass("active");
		$('#btn_save').html('<i class="fa fa-save"></i> EDIT');
		$('#new_btn_div').hide(400);		// newly added
		$('#col-sm12_div').hide(400);		// newly added
	}
	else if (form_status == 'HIDE')
	{
		$("#messages-b2").addClass("active");
		$('#new_div').hide(400);
		$('#new_btn_div').show(400);		// newly added
		$('#col-sm12_div').show(400);		// newly added
		$("#div_cd").removeClass("active");
	}
};

$.fn.reset_emp_form = function (form)
{
	try
	{
		$("#btn_remove_logo").hide();
		$("#employer_form").trigger('reset');
		$("#employer_form").parsley().reset();
		$.fn.init_crop();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.init_crop = function ()
{
	try
	{
		var $uploadCrop,
			tempFilename,
			rawImg,
			imageId;

		//reset previous codes
		$('#upload-demo').empty();

		function readFile(input)
		{
			var extension = (input.files[0].name).split('.').pop();
			var allowed_extensions = ["jpg", "jpeg", "png"];
			if (input.files && input.files[0])
			{
				var reader = new FileReader();
				reader.onload = function (e)
				{
					$('.upload-demo').addClass('ready');
					$('#cropImagePop').modal('show');
					rawImg = e.target.result;
				}
				reader.readAsDataURL(input.files[0]);
			}
		}

		$uploadCrop = $('#upload-demo').croppie({
			viewport: {
				width: 500,
				height: 32,
			},
			enforceBoundary: true,
			enableExif: true
		});

		$('#cropImagePop').on('hide.bs.modal', function ()
		{
			$('.item-img').val('');
		});

		$('#cropImagePop').on('shown.bs.modal', function ()
		{
			$uploadCrop.croppie('bind', {
				url: rawImg
			}).then(function ()
			{
				console.log('jQuery bind complete');
			});
		});

		$(document).on('change', '.item-img', function ()
		{
			imageId = $(this).data('id'); tempFilename = $(this).val();
			readFile(this);
		});
		$('#cropImageBtn').on('click', function (ev)
		{
			$uploadCrop.croppie('result', {
				type: 'rawcanvas',
				format: 'png',
				size: { width: 250, height: 16 }
			}).then(function (resp)
			{
				$("#profile_photo_base64").val(resp.toDataURL());
				$('#profile_photo-output').attr('src', resp.toDataURL());
				$('#cropImagePop').modal('hide');
			});
		});

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.change_switchery = function (obj, checked) 
{
	if (obj.is(':checked') != checked)
	{

		obj.parent().find('.switchery').trigger('click');
	}
}

$.fn.save_holiday = function (tbl_name)
{
	try
	{
		if ($('#holiday_form').parsley().validate() == false)
		{
			btn_hp_save.stop();
			return;
		}
		let data =
		{
			id: ROW_ID,
			year: $('#dd_year').val(),
			date: $('#dp_hp').val(),
			desc: $('#txt_hp_desc').val(),
			is_active: $('#chk_hp_is_active').is(':checked') ? 1 : 0,
			user_id: SESSIONS_DATA.id,
			client_id: SESSIONS_DATA.client_id
		};
		$.fn.write_data
			(
				$.fn.generate_parameter('add_edit_holiday', data),
				function (return_data)
				{
					if (return_data.data)
					{
						$.fn.populate_holiday_list(return_data.data);
						$.fn.show_right_success_noty('Data has been recorded successfully');
						$.fn.reset_form('holiday');
						btn_hp_save.stop();
						$("#btn_hp_save").removeClass("ladda-button");
					}

				}, false, btn_hp_save
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.add_upload_ph_batch = function ()
{
	try 
	{
		if (UPLOADED_PH_DATA == '')
		{
			$.fn.show_right_error_noty('Uploading data cannot be empty');
			btn_save_upload_batch.stop();
			return;
		}
		let data =
		{
			ph_data: UPLOADED_PH_DATA,
			user_id: SESSIONS_DATA.id,
			client_id: SESSIONS_DATA.client_id
			// customer_id: $('#dd_company').val()
		}
		$.fn.write_data
			(
				$.fn.generate_parameter('add_ph_upload_batch', data),
				function (return_data)
				{

					if (return_data.data)
					{
						$('#btn_add_upload_batch').modal('hide');
						$.fn.populate_uploaded_holiday(return_data.data);
						$.fn.get_holidays_list();
					}
				}, false, btn_save_upload_batch
			);
	}
	catch (e) 
	{
		$.fn.log_error(arguments.callee.caller, e.message);
	}
}

$.fn.save_edit_emp_form = function (tbl_name)
{
	try
	{
		if ($('#employer_form').parsley().validate() == false)
		{
			btn_emp_save.stop();
			return false;
		}
		var data =
		{
			employer_id: $('#employer_id').val(),
			created_by: SESSIONS_DATA.emp_id,
			employer_name: $('#employer_name').val(),
			employer_address: $('#employer_address').val(),
			prefix: $('#prefix').val(),
			mail_signature: $('#mail_signature').val(),
			phone_no: $('#phone_no').val(),
			website: $('#website').val(),
			is_active: $('#is_active').is(':checked') ? 1 : 0,
			voucher_prefix: $('#voucher_prefix').val(),
			voucher_suffix: $('#voucher_suffix').val(),
			voucher_sequence: $('#voucher_sequence').val(),
		};
		$.fn.write_data
			(
				$.fn.generate_parameter('add_edit_employer', data),
				function (return_data)
				{
					if (return_data.data)
					{
						let company_id = return_data.data;
						$.fn.fetch_data
							(
								$.fn.generate_parameter('edit_company_logo', { image: $('#profile_photo_base64').val(), company_id: company_id, emp_id: SESSIONS_DATA.emp_id }),
								function (return_data)
								{
									$("#employer_form").parsley().reset();
									btn_emp_save.stop();

									//$("#btn_emp_save").removeClass("ladda-button");
									$.fn.show_right_success_noty('Data has been recorded successfully');
									$.fn.get_employers_list();
									$.fn.show_hide_form('HIDE');
								}
							);
					}
				}, false
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_hp_detail = function (data)
{
	try
	{
		$('#holiday_form').parsley().destroy();
		var data = JSON.parse(data);
		var dateObject = new Date(data.holiday);
		ROW_ID = data.id;
		flatpickr.setDate(dateObject);//moment(data.holiday).format(UI_DATE_FORMAT)
		$('#txt_hp_desc').val(data.holiday_desc);
		$('#chk_hp_is_active').prop('checked', parseInt(data.is_active) ? true : false);
		$('#btn_hp_save').html('<i class="fa fa-check"></i>&nbsp;Update');
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_employer_details = function (data)
{
	try
	{
		var data = JSON.parse(data);
		$.fn.show_hide_form('EDIT');
		$('#employer_form').parsley().destroy();
		$('#employer_id').val(data.id);
		$('#employer_name').val(data.employer_name);
		$('#employer_address').val(data.employer_address);
		$('#prefix').val(data.prefix);
		$('#mail_signature').val(data.mail_signature);
		$('#phone_no').val(data.phone_no);
		$('#website').val(data.website);
		$('#voucher_prefix').val(data.voucher_prefix);
		$('#voucher_suffix').val(data.voucher_suffix);
		$('#voucher_sequence').val(data.voucher_sequence);
		$.fn.change_switchery($('#is_active'), (parseInt(data.is_active) ? true : false));
		$.fn.init_crop();
		if (data.attachment)
		{
			$(".gambar").attr("src", data.attachment);
		}
		if (data.is_logo == true)
		{
			$('#btn_remove_logo').show();
		}
		else
		{
			$('#btn_remove_logo').hide();
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_category_dropdown = function (data)
{
	try
	{
		if (data)
		{
			var row = '';
			for (var i = 0; i < data.length; i++)
			{
				row += `<option value=${ data[i].id }>
							${ data[i].name }
						</option>`;
			}
			$('#dd_category').html(row);
			$('#dd_category').val(data[0].id);
			if ($('#dd_year').val() != null)
				$('#dd_category').trigger('change');
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.download_template = function ()
{
	try 
	{
		window.open(`${ appConfig.PUBLIC_URL }public/download.php?key=&type=public_holiday_template`, "_blank");
	}
	catch (e)
	{
		$.fn.log_error(arguments.callee.caller, e.message);
	}
}

$.fn.bind_command_events = function ()
{
	try
	{
		$('#btn_remove_logo').click(function (e)
		{
			$.fn.remove_company_logo();
		});
		$('#btn_uploadfile').click(function (e)
		{
			e.preventDefault();
			$('#fileupload_ph').click();
		});
		$("#fileupload_ph").on("click", function (e)
		{
			e.stopPropagation();
		});
		$('#btn_reset').click(function (e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.reset_form('list');
			$.fn.get_list(false);
		});
		$('#btn_emp_reset').click(function (e)
		{
			e.preventDefault();
			$('#employer_form')[0].reset();
		});
		$('#btn_search_action').click(function (e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});
		$('#btn_load_more').click(function (e)
		{
			e.preventDefault();
			$.fn.get_list(true);
		});
		$('#btn_emp_save').click(function (e)
		{
			e.preventDefault();
			btn_emp_save = Ladda.create(this);
			btn_emp_save.start();
			$.fn.save_edit_emp_form();
		});
		$('#btn_save').click(function (e)
		{
			e.preventDefault();
			btn_save = Ladda.create(this);
			btn_save.start();
			$.fn.save_edit_form('');
		});

		$('#btn_search').click(function ()
		{
			$('#searchPanel').show();
			$('#btn_search').hide();
		});
		$('#btn_close_search').click(function ()
		{
			$('#searchPanel').hide();
			$('#btn_search').show();
		});
		$('#btn_add').click(function ()
		{
			$('#addForm').show();
			$('#tblList').hide();
		});
		$('#btn_cancel').click(function ()
		{
			$('#addForm').hide();
			$('#tblList').show();
		});
		$('#btn_emp_new').click(function (e)
		{
			e.preventDefault();
			$.fn.reset_emp_form();
			$.fn.show_hide_form('NEW');
			$('#new_btn_div').hide(400);
			$('#col-sm12_div').hide(400);
		});
		$('#btn_emp_hide').click(function (e)
		{
			e.preventDefault();
			$.fn.show_hide_form('HIDE');
			$.fn.get_employers_list();
		});
		$('#btn_dept_reset').click(function (e)
		{
			e.preventDefault();
			$.fn.reset_form(true);
		});
		$('#btn_hp_save').click(function (e)
		{
			e.preventDefault();
			btn_hp_save = Ladda.create(this);
			btn_hp_save.start();
			$.fn.save_holiday('');
		});
		$('#btn_add_upload_batch').click(function (e)
		{
			e.preventDefault();
			btn_save_upload_batch = Ladda.create(this);
			btn_save_upload_batch.start();
			$.fn.add_upload_ph_batch();
		});
		$('#btn_hp_reset').click(function (e)
		{
			e.preventDefault();
			$.fn.reset_form('holiday');
		});
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.prepare_form = function ()
{
	try
	{
		flatpickr = $("#dp_hp").flatpickr({
			altInput: true,
			altFormat: "d-M-Y",
			dateFormat: "Y-m-d",
		});
		$('#employer_form').parsley
			({
				successClass: 'has-success',
				errorClass: 'has-error',
				errors:
				{
					classHandler: function (el)
					{
						return $(el).closest('.error-container');
					},
					container: function (el)
					{
						return $(el).closest('.error-container');
					},
					errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
					errorElem: '<li></li>'
				}
			});
		$('#detail_form').parsley(
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
		$('#holiday_form').parsley
			({
				classHandler: function (parsleyField)
				{
					return parsleyField.$element.closest(".errorContainer");
				},
				errorsContainer: function (parsleyField)
				{
					return parsleyField.$element.closest(".errorContainer");
				},
			});

		$.fn.get_list(false);
		$.fn.get_employers_list();
		$.fn.populate_year_drop_down();
		// $('#dd_company').select2();
		$('#dd_category').select2();
		$('#dd_year').select2();

		$(document).on('select2:open', () =>
		{
			document.querySelector('.select2-search__field').focus();
		});
		var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
		$('.js-switch').each(function () 
		{
			new Switchery($(this)[0], $(this).data());
		});
		$.fn.change_switchery($('#is_active'), true);
		FILE_UPLOAD_PATH = `../files/temp/`;
		$.fn.intialize_fileupload('fileupload_ph', 'files_doc_upload');
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.form_load = function ()
{
	try
	{
		$.fn.prepare_form();
		$.fn.bind_command_events();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$(document).ready(function () 
{
	try
	{
		$.fn.form_load();
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
});
