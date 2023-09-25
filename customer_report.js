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
var CURRENT_PATH = '';
var loading_image = "<img src='" + CURRENT_PATH + "./assets/js/custom/busy.gif'/>";
var BLOCKUI_CSS = { border: 'none', padding: '15px', backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: .5, color: '#fff' };
var loading_text = " Just a moment...";

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

$.fn.get_attendance_project = function ()
{
	try
	{

		let search_params = new URLSearchParams(window.location.search);
		let id = search_params.get('id');
		let client_id = search_params.get('c_id');

		if (id == '')
		{
			alert("ID cannot be empty");
		}
		if (id == '')
		{
			alert("Client ID cannot be empty");
		}

		let param =
		{

			key: "xC4G+hD4s1HDnEeDZxB2xd7+3nUsjvRK8cTLi7ypnIM=",
			method: 'get_attendance_report_images',
			data:
			{
				id: id,
				client_id: client_id
			}
		};
		$.ajax
			({
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(param),
				url: services_URL,
				success: function (return_data)
				{
					if ($.fn.is_success(return_data.code) == false)
					{
						alert(return_data.msg);
					}
					else
					{
						let row = '';
						let data = return_data.data;
						let i = 0;
						while (i < (data.length - 1))
						{
							let row_item = data[i];

							row += `<div class="row">`;

							row += `<div class="col-lg-6">
										<div class="card">
											<div class="card-body">
												<div class="carousel-item active">
													<img class="d-block img-fluid" src="${ row_item.image_url }">
												</div>
											</div>
										</div>
									</div>`;
							i++;

							if (i == (data.length - 1))
							{
								row += `<div class="col-lg-6"></div>`;
							}
							else
							{
								row_item = data[i];
								row += `<div div class="col-lg-6" >
											<div class="card">
												<div class="card-body">
													<div class="carousel-item active">
														<img class="d-block img-fluid" src="${ row_item.image_url }">
													</div>
												</div>
											</div>
										</div>`;
							}

							row += `</div>`;

						}

						$('#div_images').html(row);

					}
				},
				error: function (err)
				{
					console.log(err, services_URL);

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

$(document).ready(function () 
{
	$.fn.get_attendance_project();
});