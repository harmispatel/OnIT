var btn_submit;
CURRENT_PATH = '../../';

$.fn.submit_form = function ()
{
	try
	{
		if ($('#reset_form').parsley('validate') == false)
		{
			btn_submit.stop();
			return;
		}
		$.fn.write_data
			(
				$.fn.generate_parameter('recover_password', { email: $('#txt_email').val() }),
				function (return_data)
				{
					if (return_data.data)
					{
						$.fn.show_right_success_noty('Please check your email');
					}

				}, false, btn_submit
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
		$('#reset_form').parsley
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
		$('#btn_submit').click(function (e)
		{
			e.preventDefault();
			btn_submit = Ladda.create(this);
			btn_submit.start();
			$.fn.submit_form();
		});

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