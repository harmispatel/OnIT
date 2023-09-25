$.fn.data_table_features = function ()
{
	try
	{
		if (!$.fn.dataTable.isDataTable('#tbl_list'))
		{
			table = $('#tbl_list').DataTable({
				"searching": false,
				"paging": true,
				"info": true,
				"order": [],
				// "dom": 'Bfrtip',
				buttons: [
					{ extend: "excel", className: "buttonsToHide", title: "attendance_list" },
				],
        language: { paginate: { previous: "<i class='mdi mdi-chevron-left'>", next: "<i class='mdi mdi-chevron-right'>" } },
        drawCallback: function () {
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded");
        },
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
		if ($.fn.dataTable.isDataTable('#tbl_list'))
		{
			table.destroy();
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.reset_form = function (form)
{
	try
	{
		if (form == 'list')
		{
			$('#dd_status_search').val('').change();
			$('#dd_employee_search').val('').change();
			$('#dd_project_search').val('').change();
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_list_form = function (data, is_scroll, is_empty = false)
{
	try
	{
		if (is_empty)
		{
			$('#tbl_list > tbody').empty();
		}
		// $('#total_records').html(data.length);

		if (data.length > 0)
		{
			let row = '';
			let data_val = '';

      localStorage.setItem('attendance_list', JSON.stringify(data))
			
      for (var i = 0; i < data.length; i++)
			{
				data_val = encode(JSON.stringify(data[i]));
				row += `<tr data-val="${ data_val }">
						<td>${ data[i].name }</td>
						<td>${ data[i].work_day }</td>
						<td>${ data[i].check_in_time }</td>
						<td>${ data[i].check_out_time }</td>
						<td>${ data[i].break_start }</td>
						<td>${ data[i].break_end }</td>
						<td>${ data[i].temperature }</td>
				 <td><button type="button" onclick ="$.fn.view_image(${ i })" class="btn btns" title="click to view image" data-bs-toggle="modal" data-bs-target="#exampleModal">${ data[i].image_count }</button></td>
				 <td> ${ data[i].remarks }</td> <td>`;

				if (data[i].approved == 0)
				{
					row += `<button class='btn btn-success' onclick='$.fn.approve_attendance(1,${ data[i].work_id })'>Approve</button>
							<button class='btn btn-danger' onclick='$.fn.reject_reason(2,${ data[i].work_id })'> Reject</button>`;
				}
				else if (data[i].approved == 1)
				{
					row += `Approved`;
				}
				else if (data[i].approved == 2)
				{
					row += `Rejected`;
				}
				row += '</td></tr>';
			}
			$('#tbl_list tbody').append(row);
		}

	}
	catch (err)
	{
		console.log(err.message);

		// $.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.view_image = function (indeximgarray)
{
	let img_div = '';

  const attendance_list_data = JSON.parse(localStorage.getItem('attendance_list'));

  if(attendance_list_data.length === 0)
  {
    console.log("Attendance list data not found...")
    return;
  }

  if(attendance_list_data[indeximgarray]?.files.length === 0)
  {
    console.log("File of attendance list not found...")
    return;
  }

  const imgarray = attendance_list_data[indeximgarray]?.files
  $.each(imgarray, function (id, value)
	{
		img_div += `<div class="col-lg-6 col-12" >
						<a href="${ value.image_url }" data-magnify="gallery"> <img class="w-100" src="${ value.image_url }">
						</a>
				</div> `;
	});

	$('#img_row').html(img_div);
	$('#staticBackdrop').addClass('show');
	document.getElementById("staticBackdrop").style.display = "block";
}

$.fn.get_list = function (is_scroll = true, check_item = 0)
{
	try
	{
		let param =
		{
			start_index: 0,
			limit: 10000,
			logged_user_id: SESSIONS_DATA.id,
			user_id: "",
			client_id: SESSIONS_DATA.client_id,
			status_id: "0,1,2",
			is_admin: SESSIONS_DATA.is_admin
		};

		if ($('#from_date').val() != null)
		{
			param.from_date = $('#from_date').val();
		}
		if ($('#to_date').val() != null)
		{
			param.to_date = $('#to_date').val();
		}
		if ($('#dd_employee_search').val() != null)
		{
			param.user_id = $('#dd_employee_search').val();
		}
		if ($('#dd_status_search').val() != null && $('#dd_status_search').val() != '')
		{
			param.status_id = $('#dd_status_search').val();
		}
		if (is_scroll)
		{
			param.start_index = 0;
		}

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_work_attendance', param),
				function (return_data)
				{
					if (return_data.data)
					{
						let len = return_data.data['list'].length;
						if (return_data.data.rec_index)
						{
							// RECORD_INDEX = return_data.data.rec_index;
						}
						if (return_data.code == 0 && len != 0)
						{
							let getEmpty = false;
							if (param.start_index == 0)
							{
								getEmpty = true;
							}
							$.fn.data_table_destroy();
							$.fn.populate_list_form(return_data.data.list, is_scroll, getEmpty);
							$.fn.data_table_features();
						}
						else if (return_data.code == 1 || len == 0)
						{
							if (!is_scroll)
							{
								$.fn.data_table_destroy();
								$('#tbl_list tbody').empty().append(`<tr><td colspan="10"><div class="list-placeholder">No records found!</div></td></tr>`);
							}
							else if (is_scroll)
							{
								$.fn.show_right_success_noty('No more records to be loaded');
							}
						}
					} else
					{
						$.fn.data_table_destroy();
						$('#tbl_list tbody').empty().append(`<tr><td colspan="10"><div class="list-placeholder">No records found!</div></td></tr>`);
					}
				},
				true, false, true, false
			);
	}
	catch (err)
	{
		console.log(err);
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_dd_values = function (element_id, dd_data, is_search = false)
{
	try
	{
		$(`#${ element_id }`).empty();
		if (is_search)
		{
			$(`#${ element_id }`).append(`<option value = "">All</option>`);
		}
		else if (`#${ element_id }` != 'search-condition')
		{
			$(`#${ element_id }`).append(`<option value = ""> Please Select</option>`);
		}

		for (let item of dd_data)
		{
			if (item.project_name)
			{
				item.name = item.project_name;
			}
			else if (item.status)
			{
				item.name = item.status;
			}
			$(`#${ element_id }`).append(`<option value="${ item.id }" > ${ item.name }</option>`);
		}

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.get_drop_down_values = function ()
{
	try
	{
		let data =
		{
			user_id: SESSIONS_DATA.id,
			view_all: MODULE_ACCESS.viewall,
			is_admin: SESSIONS_DATA.is_admin,
			logged_user_id: SESSIONS_DATA.id,
			client_id: SESSIONS_DATA.client_id,
			include_leave_type: false
		};

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_attendance_dropdown_list', data),
				function (return_data)
				{
					$.fn.populate_dd_values('dd_status_search', return_data.data.status);
					$.fn.populate_dd_values('dd_employee_search', return_data.data.users);
					$.fn.populate_dd_values('dd_project_search', return_data.data.projects);
				}
			);
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

		$.fn.get_drop_down_values();
		$('.populate').select2();
		$('[data-magnify]').magnify
			({
				resizable: false,
				initMaximized: true,
				headerToolbar: [
					'close'
				],
			});

		let startdate = moment().subtract(365, 'days');
		let enddate = moment();
		$('#doc_date').daterangepicker
			({
				startDate: startdate,
				endDate: enddate,
				locale: {
					format: 'DD-MMM-YYYY'
				},
				ranges: {
					'Today': [moment(), moment()],
					'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
					'Last 7 Days': [moment().subtract(6, 'days'), moment()],
					'Last 30 Days': [moment().subtract(29, 'days'), moment()],
					'This Month': [moment().startOf('month'), moment().endOf('month')],
					'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
				}
			}, function (startdate, enddate)
			{
				$('#from_date').val(startdate.format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD"));
				$('#to_date').val(enddate.format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD"));
			});
		$('#from_date').val(startdate.format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD"));
		$('#to_date').val(enddate.format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD"));

		$.fn.get_list(true);

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
		$('#btn_reset').click(function (e)
		{
			e.preventDefault();
			$.fn.get_list(true);
		});

		$('#btn_search').click(function (e)
		{
			e.preventDefault();
			$.fn.get_list(false);
		});

		$('#btn_search_action').click(function ()
		{
			$('#div_search').show();
			$('#btn_search_action').hide();
		});

		$('#btn_close_search').click(function ()
		{
			$('#div_search').hide();
			$('#btn_search_action').show();
		});

		$('#btn_load_more').click(function (e)
		{
			e.preventDefault();
			$.fn.get_list(true);
		});

		$('#add_reject_rzn_btn').click(function (e)
		{
			e.preventDefault();
			$.fn.add_reason_reject();
		});

		$('.closebtn').on('click', function ()
		{
			$('#staticBackdrop').removeClass('show');
			document.getElementById("staticBackdrop").style.display = "none";
		});

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.reject_reason = function (type, workId)
{
	try
	{
		$('#work_id_hidden').val(workId);
		$('#reject_remark_modal').modal('show');
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.add_reason_reject = function ()
{
	try
	{
		var workIdReject = $('#work_id_hidden').val();
		var reasonReject = $('#reject_remark').val();

		$.fn.approve_attendance(2, workIdReject, reasonReject);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.approve_attendance = function (type, work_id, rejectReason = null)
{
	try
	{
		let param =
		{
			work_id: work_id,
			user_id: SESSIONS_DATA.id,
			client_id: SESSIONS_DATA.client_id,
			approve_reject: type,
			remarks: ""
		};

		$.fn.write_data
			(
				$.fn.generate_parameter('approve_reject_attendance', param),
				function (return_data)
				{
					if (return_data.data)
					{
						if (type == 2)
						{
							$('#reject_remark_modal').modal('hide');
						}
						$.fn.get_list(true);
					}
				}, false, btn_save
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

function exportTable2CSVAL(title, tableId)
{
	table.button('.buttons-excel').trigger();
}

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
	$.fn.form_load();
});