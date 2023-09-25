var RECORD_INDEX = 0;
var btn_search;

$.fn.get_list = function ()
{
	try
	{
		let data =
		{
			employee_id: $('#dd_employee').val(),
			leave_year: $('#dd_leave_year').val(),
			user_id: SESSIONS_DATA.id,
			viewall: MODULE_ACCESS.viewall,
			client_id: SESSIONS_DATA.client_id
		};

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_leave_report', data),
				function (return_data)
				{
					if (return_data)
					{
						$('#tbl_list > tbody').empty();
						if (return_data.code == 0)
						{
							$('#div_report_view').show();
						}
						else
						{
							$('#div_report_view').hide();
							$.fn.show_right_error_noty('No records found!');
						}
						$.fn.pouplate_list(return_data.data);
					}
				}, true, false, true, false
			);

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.pouplate_list = function (data)
{
	try
	{
		if (data)
		{
			$('#candidate_name').html($('#dd_employee option:selected').text());
			var row = ``;
			var total = total_taken = 0;
			for (var i = 0; i < data.length; i++)
			{
				total += parseInt(data[i].no_of_days);

				let leave_details = data[i].leave_details;
				let paid = unpaid = leave_taken = 0;
				let leave_days = ``;
				for (var j = 0; j < leave_details.length; j++)
				{
					paid += leave_details[j].paid == 1 ? parseFloat(leave_details[j].leave_no_of_days) : 0;
					unpaid += leave_details[j].paid == 0 ? parseFloat(leave_details[j].leave_no_of_days) : 0;
					leave_taken += parseFloat(leave_details[j].leave_no_of_days);
					leave_days += `${ leave_details[j].leave_date }(${ parseFloat(leave_details[j].leave_no_of_days) })<br>`;
				}
				total_taken += leave_taken;
				let paid_html = paid == 0 ? `` : `&nbsp;&nbsp;<span class="badge bg-pink">${ paid } - PAID</span>`;
				let unpaid_html = unpaid == 0 ? `` : `&nbsp;&nbsp;<span class="badge bg-blue">${ unpaid } - UNPAID</span>`;

				row += `<tr>
							<td>${ data[i].descr }</td>
							<td>${ data[i].no_of_days }</td>
							<td>${ leave_taken }${ paid_html }${ unpaid_html }</td>
							<td>${ parseFloat(data[i].no_of_days) - leave_taken }</td>
							<td>
								<button type="button" class="btn btn-primary btn-sm" data-plugin="tippy" data-tippy-placement="right" data-tippy-trigger="click" data-tippy-arrow="true" title="${ leave_days }">Show Details</button>
							</td>
						</tr>`;
			}

			row += `<tr>
						<td><b>Total</b></td>
						<td><b>${ total }</b></td>
						<td><b>${ total_taken }</b></td>
						<td><b>${ total - total_taken }</b></td>
						<td></td>
					</tr>`;

			$('#tbl_list tbody').append(row);
			if ($('[data-plugin="tippy"]').length > 0)
			{
				tippy('[data-plugin="tippy"]');
			}
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}

};
$.fn.get_leave_approval_dropdown_data = function ()
{
	try
	{
		let data =
		{
			logged_user_id: SESSIONS_DATA.id,
			is_supervisor: SESSIONS_DATA.is_supervisor,
			is_admin: SESSIONS_DATA.is_admin,
			viewall: MODULE_ACCESS.viewall,
			client_id: SESSIONS_DATA.client_id
		};

		$.fn.fetch_data
			(
				$.fn.generate_parameter('get_approval_dropdown_list', data),
				function (return_data)
				{
					if (return_data.data)
					{
						$.fn.populate_dd_values(return_data.data);
					}
				}, true
			);
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.populate_dd_values = function (dd_data)
{
	try
	{
		$('#dd_employee').empty();
		for (let item of dd_data.users)
		{
			$('#dd_employee').append(`<option data-type="expenses" data="${ encode(JSON.stringify(item)) }" value="${ item.id }">${ item.name } </option>`);
		}
		// $('#dd_leave_type').empty();
		// $('#dd_leave_type').append(`<option value="ALL">ALL</option>`);
		// for (let item of dd_data.leave_type)
		// {
		// 	$('#dd_leave_type').append(`<option data-type="emp_leave_type"  data="${ encode(JSON.stringify(item)) }" value="${ item.id }">${ item.descr } </option>`);
		// }

	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

$.fn.intialize_datepicker = function ()
{
	try
	{
		var startdate = moment().subtract(365, 'days');
		var enddate = moment();
		$('#doc_date').daterangepicker({
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
		$('.populate').select2();
		$('#search_form').parsley
			({
				successClass: 'has-success',
				errorClass: 'has-error',
				errors:
				{
					classHandler: function (el)
					{
						return $(el).closest('.form-group');
					},
					errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
					errorElem: '<li></li>'
				}
			});

		// $.fn.intialize_datepicker();
		$.fn.get_leave_approval_dropdown_data();
		RECORD_INDEX = 0;
		// $.fn.get_list(false);

		// if ($('[data-plugin="tippy"]').length > 0)
		// {
		// 	tippy('[data-plugin="tippy"]');
		// }

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

$.fn.bind_command_events = function ()
{
	try
	{
		$('#btn_reset').click(function (e)
		{
			e.preventDefault();
			// $('#dd_leave_type').val('ALL').change();
			// $('#dd_employee').val('ALL').change();
			$.fn.intialize_datepicker();

			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});

		$('#btn_search').click(function (e)
		{
			$('#searchPanel').show();
			$('#btn_search').hide();
		});

		$('#btn_close_search').click(function ()
		{
			$('#searchPanel').hide();
			$('#btn_search').show();
		});
		$('#btn_search_action').click(function (e)
		{
			e.preventDefault();
			RECORD_INDEX = 0;
			$.fn.get_list(false);
		});
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