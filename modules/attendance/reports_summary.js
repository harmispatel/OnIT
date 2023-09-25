var loading_text = " Just a moment...";

$.fn.data_table_features = function ()
{
	try
	{
		if (!$.fn.dataTable.isDataTable('#tbl_list'))
		{
			table = $('#tbl_list').DataTable({
				"searching": false,
				"paging": false,
				"info": false,
				"order": [],
				"dom": 'Bfrtip',
				buttons: [
					{extend: "excel", className: "buttonsToHide",title:"attendance_report"},
				  ]
			});
		}
	}
	catch (err)
	{
		$.fn.log_error(arguments.callee.caller, err.message);
	}
};

function exportTable2PDF(title,tableId,orientation){

    var doc = new jsPDF(orientation, 'pt', 'a4');

    var htmlcontent = $('#'+tableId+'').html();
    var $jQueryObject = $($.parseHTML(htmlcontent));
    $jQueryObject.find(".ng-hide").remove();
    $jQueryObject.find(".text-danger").remove();
    $jQueryObject.find(".collapse").remove();

    var i = 0;
    var columns = [],
        rows = [],
        ignoreColumn = [];

    $jQueryObject.find('tr').each(function() {
         if(i==0) {
            var k = 0, m = 0, n = 0;
             $(this).find('th').each(function (index, data) {
                 if($(this).attr('id') != "ignorePdf"){
                    columns[k] = $(this)[0].innerText.trim();
                     k++;
                 }
                 else{
                    ignoreColumn[m] = n;
                    m++;
                 }
                 n++;
             });
         }
         else{
             var l = 0, q = 0;
             var rowData = [];
             //$(this).filter(':visible').find('td').each(function(index,data) {
             $(this).find('td').each(function(index,data) {
                 if(ignoreColumn.indexOf(q) == -1){
                    rowData[l] = $(this)[0].innerText.trim();
                    l++;
                 }
                 q++;
             });
             if(l > 0) {
                 rows[i - 1] = rowData;
             }
             if(l == 0){
                 i = i - 1;
             }
         }
         i++;
     });

    var dateObj = new Date();
    var currentDate = dateObj.getDate()+"/"+(dateObj.getMonth() + 1)+"/"+dateObj.getFullYear();

    doc.autoTable(columns, rows, {
        theme: 'striped',
        margin: {top: 60},
        styles: {overflow: 'linebreak'},
        bodyStyles: {valign: 'top'},
        beforePageContent: function(data) {
            doc.text(title, 40, 50);
        },
        afterPageContent: function(data) {
            doc.text(currentDate, 40, doc.internal.pageSize.height - 30);
        }
    });
    doc.save(title.trim()+".pdf");
}
function exportTable2CSVAR(title,tableId){

    table.button( '.buttons-excel' ).trigger();


}
$.fn.get_everything_at_once_altrawise = function (data, details = false) {
  try {
    $.fn.fetch_data(
      $.fn.generate_parameter("get_everything_at_once_altrawise", data),
      function (return_data) {
        if (return_data) {
          var allData = return_data.data;
          var allDataArray;
          for (let i = 0; i < allData.length; i++) {
            allDataArray = JSON.parse(allData[i]);
            window[data[i].func](allDataArray.data, details);
          }
        }
      },
      true
    );
  } catch (err) {
    // console.log(err.message);
    $.fn.log_error(arguments.callee.caller,err.message);
  }
};
function get_attendance_reports_employee(rowData = false) {
	try {
	  let row = "<option value=''>All</option>";
	  if (rowData) {
		for (var i = 0; i < rowData.length; i++) {
		  let jsval = escape(JSON.stringify(rowData[i]));
		  row += `<option data-val="${jsval}" value=${rowData[i].id}>
							   ${rowData[i].desc}
						   </option>`;
		}
		$("#dd_employee").html(row);
		$("#dd_employee").select2();
	  }
	} catch (err) {
	  // console.log(err.message);
	  $.fn.log_error(arguments.callee.caller,err.message);
	}
  }
$.fn.get_report_list = function ()
{
    try
    {
        let total_claim = 0;
        let datemonth = moment($('#dp_month').val(), 'MMM-YYYY');
        let data =
        {
            client_id: SESSIONS_DATA.client_id,
            from_date: $('#from_date').val(),
            to_date: $('#to_date').val()
        }
        if ($('#employee_select').val() != ""){
			data.user_id = $('#employee_select').val();
		}

        $.fn.fetch_data
            (
                $.fn.generate_parameter('get_attendance_report', data),
                function (return_data)
                {
                    $('#title_month_year').html(datemonth.format('MMMM YYYY'));
                    $('#tbody').empty();
                    
                    if(return_data.data != null){
                        if(return_data.data.length > 0){
                            if (return_data.data)
                            {
                                let row = '';
                                data = return_data.data;
                                console.log("data"+data);
                                for (var i = 0; i < data.length; i++)
                                {
                                    row += `<tr id="TR_ROW_${i}" style="cursor: pointer;"
                                            onclick="$.fn.populate_detail_form(unescape( $(this).closest('tr').attr('data-value')),this )"
                                            data-value="${escape(JSON.stringify(data[i]))}">
                                            
                                            <td>${data[i].name}`; data[i].office_email != null ? row +=`(${data[i].office_email})` : row +=`</td>
                                            <td>${data[i].total_work_days}</td>
                                            <td>${data[i].total_break_days}</td> 
                                            <td>${data[i].total_ot_days}</td> 
                                            <td>${data[i].emergency_leave}</td> 
                                            <td>${data[i].medical_leave}</td>
                                            <td>${data[i].annual_leave}</td>
                                            <td>${data[i].unpaid_leave}</td>
                                        </tr>`;    
                                }
                                
                                $('#tbody').append(row);
                            }
                        }
                    }
                    
                    if(return_data.data == null){
                        var emptyTr = `<tr>
                        <td colspan="8">
                            <div class="list-placeholder">No records found!</div>
                        </td>
                    </tr>`
                        $('#tbody').append(emptyTr);
                    }

                }, true
            );
            $.fn.data_table_features();
    }
    catch (e)
    {
        $.fn.log_error(arguments.callee.caller, e.message);
    }
};
$.fn.bind_command_events = function()
 {	
	 try
	 {
		$('#showSearchDiv').on('click', function (e)
        {
            e.preventDefault();
            $('#searchDiv').show();
			$("#showSearchDiv").hide();
        });
		$('#closeSearch').on('click', function (e)
        {
            e.preventDefault();
            $('#searchDiv').hide();
			$("#showSearchDiv").show();
        });
        $('#btn_search').on('click', function (e)
        {
            e.preventDefault();
            $.fn.data_table_destroy();
            $.fn.get_report_list();
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
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }			
 };
 
 $.fn.prepare_form = function()
 {	
	 try
	 {
		$("#searchDiv").hide();
        $('.select2Plugin').select2();
		let params = {
			emp_id:SESSIONS_DATA.emp_id
		}
		let data = [
			{ func: "get_attendance_reports_employee", params: params },
		];
		$.fn.get_everything_at_once_altrawise(data);
		var startdate = moment();
		$('#dp_month').val(startdate.format("MMM-YYYY"));
		$("#dp_month").flatpickr({
		 plugins: [new monthSelectPlugin({
			  shorthand: true,
			 dateFormat: "M-Y", //defaults to "F Y"
          altFormat: "F Y", //defaults to "F Y"
		 })],
		});
		$("#dd_employee").select2();
		$.fn.get_report_list();
	 }
	 catch(err)
	 {
		 console.log(err);
		 //$.fn.log_error(arguments.callee.caller,err.message);
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

$.fn.set_filter_data = function (type,workId)
{
	try
	{
		let SESSIONS_DATA_F = $.jStorage.get('session_data');
		let paramFilter =
		{
			"token": SESSIONS_DATA_F.token,
			"method": "get_users_list_for_filters",
			"data": {
				"is_admin" : SESSIONS_DATA_F.is_admin,
				"logged_user_id" : SESSIONS_DATA_F.id,
				"client_id": SESSIONS_DATA_F.client_id,
			}
		};
		$.ajax
			({
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(paramFilter),
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
						$.each(data.data.users, function(key, value) {   
							$('#employee_select').append($("<option></option>").attr("value", value.id).text(value.name)); 
					   	});
						//    $.each(data.data.status, function(key, value) {   
						// 	$('#status_select').append($("<option></option>").attr("value", value.id).text(value.status)); 
					   	// });
						// datatableA.redraw();
						// $('#tbl_list').DataTable().ajax.reload();
					}
				},
				error: function (err)
				{
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
 
 $.fn.form_load = function()
 {
	 try
	 {	
		$.fn.prepare_form();
		$.fn.bind_command_events();	
	 }
	 catch(err)
	 {
		 $.fn.log_error(arguments.callee.caller,err.message);
	 }
 };
 
 $(document).ready(function () 
 {
	 try
	 {	
         $.fn.set_filter_data();
         $.fn.intialize_datepicker();
         $.fn.form_load();
         
	 }
	 catch (err)
	 {
		 $.fn.log_error(arguments.callee.caller, err.message);
	 }
 });
 
