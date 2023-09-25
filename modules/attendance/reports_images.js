function exportTable2PDF(title, tableId, orientation)
{

	var doc = new jsPDF(orientation, 'pt', 'a4');

	var htmlcontent = $('#' + tableId + '').html();
	var $jQueryObject = $($.parseHTML(htmlcontent));
	$jQueryObject.find(".ng-hide").remove();
	$jQueryObject.find(".text-danger").remove();
	$jQueryObject.find(".collapse").remove();

	var i = 0;
	var columns = [],
		rows = [],
		ignoreColumn = [];

	$jQueryObject.find('tr').each(function ()
	{
		if (i == 0)
		{
			var k = 0, m = 0, n = 0;
			$(this).find('th').each(function (index, data)
			{
				if ($(this).attr('id') != "ignorePdf")
				{
					columns[k] = $(this)[0].innerText.trim();
					k++;
				}
				else
				{
					ignoreColumn[m] = n;
					m++;
				}
				n++;
			});
		}
		else
		{
			var l = 0, q = 0;
			var rowData = [];
			//$(this).filter(':visible').find('td').each(function(index,data) {
			$(this).find('td').each(function (index, data)
			{
				if (ignoreColumn.indexOf(q) == -1)
				{
					rowData[l] = $(this)[0].innerText.trim();
					l++;
				}
				q++;
			});
			if (l > 0)
			{
				rows[i - 1] = rowData;
			}
			if (l == 0)
			{
				i = i - 1;
			}
		}
		i++;
	});

	var dateObj = new Date();
	var currentDate = dateObj.getDate() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getFullYear();

	doc.autoTable(columns, rows, {
		theme: 'striped',
		margin: { top: 60 },
		styles: { overflow: 'linebreak' },
		bodyStyles: { valign: 'top' },
		beforePageContent: function (data)
		{
			doc.text(title, 40, 50);
		},
		afterPageContent: function (data)
		{
			doc.text(currentDate, 40, doc.internal.pageSize.height - 30);
		}
	});
	doc.save(title.trim() + ".pdf");
}

function exportTable2CSVAR(title, tableId)
{

	table.button('.buttons-excel').trigger();


}

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

$.fn.get_list = function ()
{
	try
	{
		let data =
		{
			emp_id: $('#dd_employee_search').val(),
			project_id: $('#dd_project_search').val(),
			from_date: $('#from_date').val(),
			to_date: $('#to_date').val(),
			client_id: SESSIONS_DATA.client_id,
			user_id: SESSIONS_DATA.id
		}

    $.fn.fetch_data
			(
				$.fn.generate_parameter('get_attendance_images', data),
				function (return_data)
				{
          $('#detail_images').html('');

					// need to generate the image, the output is done

          for(const idx in return_data.data) {
            const card = `<div class="item  col-xs-1 col-sm-1">

              <div class="thumbnail">
                <img class="avatar-lg preview-image group list-group-image" src="${return_data.data[idx]?.image_url}" alt="" />
              </div>
            </div>`;
            $('#detail_images').append(card)
          }
          $('.attendance_images').show();

				}, true
			);
	}
	catch (e)
	{
		$.fn.log_error(arguments.callee.caller, e.message);
	}
};

$.fn.bind_command_events = function ()
{
	try
	{
		$('#btn_search_action').on('click', function (e)
		{
			e.preventDefault();
			$('#div_search').show();
			$("#btn_search_action").hide();
		});

		$('#btn_close_search').on('click', function (e)
		{
			e.preventDefault();
			$('#div_search').hide();
			$("#btn_search_action").show();
		});

		$('#btn_search').on('click', function (e)
		{
			e.preventDefault();
			$.fn.get_list(false);
		});

		$('#btn_reset').click(function (e)
		{
			e.preventDefault();
			// var startdate = moment();
			// $('#dp_month').val(startdate.format("MMM-YYYY"));
			// $("#dp_month").flatpickr({
			// plugins: [new monthSelectPlugin({
			//     shorthand: true,
			//     dateFormat: "M-Y", //defaults to "F Y"
			// altFormat: "F Y", //defaults to "F Y"
			// })],
			// });
			// $('#dd_employee').val('').change();
			// $.fn.get_report_list();
			$.fn.intialize_datepicker();
			$("#employee_select").val("").trigger('change');
			$.fn.get_report_list();

		});

    $('#list').click(function (event) { event.preventDefault(); $('#detail_images .item').addClass('list-group-item'); });
    $('#grid').click(function (event) { event.preventDefault(); $('#detail_images .item').removeClass('list-group-item'); $('#products .item').addClass('grid-group-item'); });

    // Image Preview with Carousel
    $("body").on('click','.preview-image', function () {
      var images = []; // Store all images to be displayed in the carousel
      var currentIndex = 0;
      var clickedEl = $(this)

      // Populate the images array with all preview images
      $(".preview-image").each(function (index) {
        images.push({
          src: $(this).attr("src"),
          alt: $(this).attr("alt")
        });

        // Set the current index when the clicked image is found
        if (clickedEl.is($(this))) {
          currentIndex = index;
        }
      });

      // Create the carousel items
      var carouselItems = images.map(function (image, index) {
        return `
              <div class="carousel-item ${index === currentIndex ? 'active' : ''}">
                  <img src="${image.src}" alt="${image.alt}" class="d-block w-100">
              </div>
          `;
      });

      // Update the carousel inner content and show the modal
      $("#image-carousel .carousel-inner").html(carouselItems.join(''));
      $("#image-preview-modal").modal("show");
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
		$.fn.get_drop_down_values();
		$("#div_search").hide();
		$('.populate').select2();
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

	}
	catch (err)
	{
		console.log(err);
		//$.fn.log_error(arguments.callee.caller,err.message);
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

