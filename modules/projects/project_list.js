var FORM_STATE = 0;
var RECORD_INDEX = 0;
var btn_save, btn_warranty_save, btn_assign_save;
ASSET_ID = '';
var FILE_UPLOAD_PATH = '';
var drop_down_values = [];
var fields_with_drop_down = ['status'
  , 'asset_type'
  , 'asset_owner'
  , 'stake_holders'
  , 'expiry_type'
  , 'assigned_to'
  , 'asset_status'
];
var fields_with_datepicker = ['purchase_date'
  , 'expiry_date'
  , 'taken_date'
  , 'return_date'
];
var fields_with_numbers = [];
var loading_text = " Just a moment...";
var datatableA = $('#tbl_list');

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
                //   {extend: "excel", className: "buttonsToHide",title:"attendance_list"},
                ]
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
      FORM_STATE = 0;

      if (form == 'list')
      {
          $('#dd_employee_search').val('').change();
          $('#dd_asset_type_search').val('').change();
      }
      else if (form == 'form')
      {
          ASSET_ID = '';
          $('#dd_employee').val('').change();
          $('#dd_asset_type').val('').change();
          $('#dd_client').val('').change();
          $('#dd_asset_owner').val('').change();
          $('#purchase_date').val('');
          $('#dd_expiry_type').val('').change();
          $('#expiry_date').val('');
          $('#txt_serial_no').val('');
          $('#txt_asset_name').val('');
          $('#txt_brand').val('');
          $('#txt_product_value').val('');
          $('#txt_quantity').val('');
          $('#dd_status').val('');
          $('#taken_date').val('');
          $('#return_date').val('');
          $('#txt_contractor').val('');
          $('#txt_warranty_remarks').val('');
          $("#table_assign_list").empty();
          $('#project_form_id').parsley('destroy');
          $('#project_form_id').parsley
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
      else if (form == 'assign_new')
      {
          $('#txt_assign_id').val('');
          $('#dd_employee').val('').change();
          $('#taken_date').val('');
          $('#return_date').val('');
          $('#dd_assign_status').val('').change();
          $('#txt_assign_remarks').val('');

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

      if ($('#project_form_id').parsley().validate() == false)
      {
          btn_save.stop();
          return;
      }
      else
      {
          var data =
          {
            id  : "",
            name  : $('#validationCustom01').val(),
            desc  : $('#description').val(),
            amount :$('#amount').val(),
            spend :$('#spend').val(),
            type :$('#type').val(),
            invoice_date :$('#invoicedate').val(),
            from_date :$('#fromdate').val(),
            to_date :$('#todate').val(),
            customer_id :$('#customer_id').val(),
            json_field  : {},
            client_id  : 1,
            
            user_id: SESSIONS_DATA.id,
            user_data: $.fn.generate_project_user_form_data()
          };

          $.fn.write_data
              (
                  $.fn.generate_parameter('add_edit_projects', data),
                  function (return_data)
                  {
                    $('#h4_primary_no').text('Asset No : ' + ASSET_ID);
                    $('#div_sub_details').show();
                    $.fn.show_right_success_noty('Data has been recorded successfully');

                  }, true, btn_save
              );

      }
  }
  catch (err)
  {
    console.log(err)
    return
      // $.fn.log_error(arguments.callee.caller, err.message);
  }
};

$.fn.save_edit_warranty_form = function ()
{
  try
  {
      let json_field = {
          contractor: $('#txt_contractor').val(),
          warranty_remarks: $('#txt_warranty_remarks').val()
      };

      var data =
      {
          id: ASSET_ID,
          expiry_type_id: $('#dd_expiry_type').val(),
          expiry_date: $('#expiry_date').val(),
          json_field: json_field,
          emp_id: SESSIONS_DATA.emp_id
      };

      $.fn.write_data
          (
              $.fn.generate_parameter('add_edit_asset_warranty', data),
              function (return_data)
              {
                  if (return_data.data)
                  {
                      $.fn.show_right_success_noty('Data has been recorded successfully');
                  }

              }, true, btn_warranty_save
          );
  }
  catch (err)
  {
      $.fn.log_error(arguments.callee.caller, err.message);
  }
};

$.fn.save_edit_assign_form = function ()
{
  try
  {
      if ($('#assign_form').parsley('validate') == false)
      {
          btn_assign_save.stop();
          return;
      }
      else
      {
          var data =
          {
              id: $('#txt_assign_id').val(),
              asset_id: ASSET_ID,
              assigned_to_id: $('#dd_employee').val(),
              taken_date: $('#taken_date').val(),
              return_date: $('#return_date').val(),
              is_active: $('#dd_assign_status').val(),
              remarks: $('#txt_assign_remarks').val(),
              emp_id: SESSIONS_DATA.emp_id
          };

          $.fn.write_data
              (
                  $.fn.generate_parameter('assign_asset_to_employee', data),
                  function (return_data)
                  {
                      if (return_data.data)
                      {
                          $.fn.show_right_success_noty('Data has been recorded successfully');
                          $('#new_assign_div').hide();
                          $('#btn_new_access').show();
                          $.fn.get_asset_employees_list();
                      }

                  }, true, btn_assign_save
              );

      }
  }
  catch (err)
  {
      $.fn.log_error(arguments.callee.caller, err.message);
  }
};

$.fn.populate_list_form = function (data,is_scroll,isEmpty=false)
{
  try
  {
      if(is_scroll == false){
          $('#tbl_list > tbody').empty();
      }
      $('#total_records').html(data.length);
      if (data.length > 0)
      {
          let row = '';
          let data_val = '';
          for (var i = 0; i < data.length; i++)
          {
              
              data_val = escape(JSON.stringify(data[i]));

              row += '<tr>' +
                  '<td>' + data[i].project_name + '</td>';
              data[i].project_description != null ? row += '<td>' + data[i].project_description + '</td>' : row += '<td>-</td>';
              data[i].project_amount != null ? row += '<td>' + data[i].project_amount + '</td>' : row += '<td>-</td>';
              data[i].project_spend != null ? row += '<td>' + data[i].project_spend + '</td>' : row += '<td>NA</td>';
              data[i].project_type != null ? row += '<td>' + data[i].project_type + '</td>' : row += '<td>-</td>';
              data[i].invoice_date != null ? row += '<td>' + data[i].invoice_date + '</td>' : row += '<td>-</td>';
              data[i].active_from_date != null ? row += '<td>' + data[i].active_from_date + '</td>' : row += '<td>-</td>';
              data[i].inactive_from_date != null ? row += '<td>' + data[i].inactive_from_date + '</td>' : row += '<td>-</td>';
              data[i].created_by != null ? row += '<td>' + data[i].created_by + '</td>' : row += '<td>-</td>';
              row += `<td><div class="d-flex"><button type="button" class="btn editbtn btn-success" title="Edit" onclick='$.fn.edit_modal(${JSON.stringify(data[i])})'><i class="fas fa-sign-in-alt"></i></button><button type="button" class="btn viewbtn btn-primary" title="View" onclick='$.fn.view_modal(${JSON.stringify(data[i])})'><i class="fas fa-eye"></i></button></div></td>`;

              row += '</tr>';
              
          }
          $('#tbl_list tbody').append(row);
          $('#div_load_more').show();
      }

  }
  catch (err)
  {
      $.fn.log_error(arguments.callee.caller, err.message);
  }
};

$.fn.get_list = function (is_scroll = true, check_item = 0)
{
  try
  {
      var post_values = [];
      var param = {
            project_desc : "",
            project_name : "",
          user_id: SESSIONS_DATA.id,
          client_id: SESSIONS_DATA.client_id,
      };
      
      if ($('#project_name_id').val() != ''){
          param.project_name = $('#project_name_id').val();
      }
      if ($('#description_id').val().trim() != ""){
          param.project_desc = $('#description_id').val();
      }

      if (is_scroll)
      {
          param.start_index = RECORD_INDEX;
      }

      $.fn.fetch_data(
          $.fn.generate_parameter('get_projects_list', param),
          function (return_data)
          {
              if (return_data.data)
              {
                  var len = return_data.data.length;
                
                  if (return_data.data.rec_index)
                  {
                      RECORD_INDEX = return_data.data.rec_index;
                  }
                  if (return_data.code == 0 && len != 0)
                  { var getEmpty = false;
                      if(param.start_index == 0){
                          getEmpty = true;
                      }
                      $.fn.data_table_destroy();
                      $.fn.populate_list_form(return_data.data, is_scroll,getEmpty);
                      $.fn.data_table_features();
                    
                  }
                  else if (return_data.code == 1 || len == 0)
                  {
                      if (!is_scroll)
                      {
                          $('#btn_load_more').hide();
                          $.fn.data_table_destroy();
                          $('#tbl_list tbody').empty().append
                              (
                                  `<tr>
                                      <td colspan="8">
                                          <div class="list-placeholder">No records found!</div>
                                      </td>
                                  </tr>`
                              );
                      }
                      else if (is_scroll)
                      {
                          $('#btn_load_more').hide();
                          
                          $.fn.show_right_success_noty('No more records to be loaded');
                      }
                  }
              } else
              {
                  $('#btn_load_more').hide();
                  $.fn.data_table_destroy();
                  $('#tbl_list tbody').empty().append
                      (
                          `<tr>
                              <td colspan="8">
                                  <div class="list-placeholder">No records found!</div>
                              </td>
                          </tr>`
                      );
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

$.fn.get_drop_down_values1 = function ()
{
  try
  {
      var param = {
          emp_id: SESSIONS_DATA.emp_id,
          view_all: MODULE_ACCESS.viewall,
      };
      $.fn.fetch_data
          (
              $.fn.generate_parameter('get_document_search_assest_check', param),
              function (return_data)
              {
                  $.fn.populate_dd_values('search-field', return_data.data.columns);
                  $.fn.populate_dd_values('search-condition', return_data.data.conditions);
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
      $('.' + element_id).empty();
      if (is_search)
      {
          $('.' + element_id).append(`<option value="">All</option>`);
      }
      else if (element_id != 'search-condition')
      {
          $('.' + element_id).append(`<option value="">Please Select</option>`);
      }

      for (let item of dd_data)
      {
          $('.' + element_id).append(`<option value="${ item.id }">${ item.descr }</option>`);
      }

  }
  catch (err)
  {
      $.fn.log_error(arguments.callee.caller, err.message);
  }
};

$.fn.populate_detail_form = function (data)
{
  try
  {
      var data = JSON.parse(data);
      $.fn.show_hide_form('EDIT');
      $('#project_form_id').parsley().destroy();
      $('#h4_primary_no').text('Asset No : ' + data.id);

      $.fn.fetch_data
          (
              $.fn.generate_parameter('get_assets_details', { id: data.id }),
              function (return_data)
              {
                  if (return_data.data.details)
                  {
                      var data = return_data.data.details;
                      ASSET_ID = data.id;
                      let json_field = $.fn.get_json_string(data.json_field);

                      $('#dd_employee').val(data.employee_id).change();
                      $('#dd_asset_type').val(data.type_id).change();
                      $('#dd_client').val(data.client_id).change();
                      $('#dd_asset_owner').val(data.owner_id).change();
                      $('#dd_status').val(data.status_id).change();
                      $('#purchase_date').flatpickr({ dateFormat: "d-M-Y" }).setDate(data.purchase_date);
                      $('#dd_expiry_type').val(data.expiry_type_id).change();
                      $('#expiry_date').flatpickr({ dateFormat: "d-M-Y" }).setDate(data.expiry_date);
                      $('#txt_serial_no').val(data.serial_no);
                      $('#txt_asset_name').val(data.asset_name);
                      $('#txt_brand').val(data.brand_name);
                      $('#txt_product_value').val(data.product_value);
                      $('#txt_quantity').val(data.quantity);
                      $('#taken_date').val(data.taken_date);
                      $('#return_date').val(data.return_date);

                      if (json_field.contractor != undefined)
                      {
                          $('#txt_contractor').val(json_field.contractor);
                      }
                      else
                      {
                          $('#txt_contractor').val('');
                      }

                      if (json_field.warranty_remarks != undefined)
                      {
                          $('#txt_warranty_remarks').val(json_field.warranty_remarks);
                      }
                      else
                      {
                          $('#txt_warranty_remarks').val('');
                      }

                      for (let i = 0; i < data.attachment.length; i++)
                      {
                          data.attachment[i]['name'] = data.attachment[i]['filename'];
                          data.attachment[i]['uuid'] = data.attachment[i]['id'];
                          data.attachment[i]['deleteFileParams'] = JSON.stringify(data.attachment[i]);
                          delete data.attachment[i]['filename'];
                          delete data.attachment[i]['id'];
                      }

                      $.fn.populate_fileupload(data, 'files', true);
                      $.fn.get_asset_employees_list();
                  }
              }, true, false, true, false
          );

  }
  catch (err)
  {
      $.fn.log_error(arguments.callee.caller, err.message);
  }
};

$.fn.delete_asset = function (data)
{
  try
  {
      RECORD_INDEX = 0;
      data = JSON.parse(data);

      var data =
      {
          id: data.id,
          employee_id: $('#dd_employee_search').val(),
          type_id: $('#dd_asset_type_search').val(),
          start_index: RECORD_INDEX,
          limit: LIST_PAGE_LIMIT,
          emp_id: SESSIONS_DATA.emp_id,
          view_all: MODULE_ACCESS.viewall
      };

      bootbox.confirm
          ({
              title: "Delete Confirmation",
              message: "Please confirm before you delete.",
              buttons:
              {
                  cancel:
                  {
                      label: '<i class="fa fa-times"></i> Cancel'
                  },
                  confirm:
                  {
                      label: '<i class="fa fa-check"></i> Confirm'
                  }
              },
              callback: function (result)
              {
                  if (result == true)
                  {
                      $.fn.write_data
                          (
                              $.fn.generate_parameter('delete_asset', data),
                              function (return_data)
                              {
                                  if (return_data)
                                  {
                                      $('#tbl_list > tbody').empty();
                                      $.fn.get_list(true, 1);
                                      $.fn.show_right_success_noty('Data has been deleted successfully');
                                  }

                              }, true, false, true, false
                          );
                  }
              }
          });
  }
  catch (err)
  {
      $.fn.log_error(arguments.callee.caller, err.message);
  }
};

$.fn.show_hide_form = function (form_status)
{
  $.fn.reset_form('form');

  if (form_status == 'NEW')
  {
      $('#view-list').hide(400);
      $('#list_div').hide(400);
      $('#new_div').show(400);
      $('#h4_primary_no').text('');
      $('#div_sub_details').hide();
      $.fn.init_upload_file();
  }
  else if (form_status == 'EDIT')
  {
      $('#view-list').hide(400);
      $('#list_div').hide(400);
      $('#new_div').show(400);``
      $('#div_sub_details').show();
      $.fn.reset_form('assign_new');
      $.fn.init_upload_file();

      // Load users of project
      $.fn.fetch_project_user(
        {
          "project_id": $('#editid').val(),
          "user_id": SESSIONS_DATA.id, // SESSIONS_DATA.id (current logged user)
          "client_id": 1
        }
      )

  }
  else if (form_status == 'BACK')
  {
      $('#view-list').show(400);
      $('#tblList').show(400);
      $('#list_div').show(400);
      $('#new_div').hide(400);
  }

};

$.fn.fetch_project_user = (data) => {
  $.fn.fetch_data(
      $.fn.generate_parameter('get_project_user_list', data),
      function (response)
      {
        const selectized = $('.day-selector.selectized');
        const { data: users} = response
        const activeUsers = users.filter((user, i) => {
          return user.is_active === 1;
        })

        for(const userIndex in activeUsers)
        {
          $.fn.addNewField(users[userIndex])
        }
      }
  );
}

$.fn.get_drop_down_values = function ()
{
  try
  {
      var data =
      {
          emp_id: SESSIONS_DATA.emp_id,
          view_all: MODULE_ACCESS.viewall
      };

      $.fn.fetch_data
          (
              $.fn.generate_parameter('get_asset_drop_down_values', data),
              function (return_data)
              {
                  drop_down_values = return_data;
                  $.fn.populate_dd('dd_status', return_data.data.status);
                  $.fn.populate_dd('dd_asset_type', return_data.data.asset_type);
                  $.fn.populate_dd('dd_asset_owner', return_data.data.asset_owner);
                  $.fn.populate_dd('dd_client', return_data.data.stake_holders);
                  $.fn.populate_dd('dd_expiry_type', return_data.data.expiry_type);
                  $.fn.populate_dd('dd_employee', return_data.data.employees);
                  $.fn.populate_dd('dd_assign_status', return_data.data.asset_status);
              }
          );
      ` `
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

      $.fn.get_list(true);

    //   $.fn.get_drop_down_values();
    //   $.fn.get_drop_down_values1();
      $('.populate').select2();
      $('[data-magnify]').magnify({
        resizable: false,
        initMaximized: true,
        headerToolbar: [
          'close'
        ],
      });
      $('#purchase_date,#expiry_date,#taken_date,#return_date').flatpickr({
          altInput: true,
          altFormat: "d-M-Y",
          dateFormat: "Y-m-d",
          enableTime: false,
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
      $('#project_form_id').parsley(
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

$.fn.init_upload_file = function ()
{
  $.fn.intialize_fileupload('doc_upload', 'files');
};

$.fn.assign_form = function (form_status, reset_form)
{
  $('#assign_form').parsley().destroy();
  $.fn.set_validation_form();
  $.fn.reset_form('assign_new');
  $('#new_assign_div').show();
  $('#btn_new_access').hide();
};

$.fn.set_validation_form = function ()
{
  $('#assign_form').parsley
      ({
          successClass: 'has-success',
          errorClass: 'has-error',
          errors:
          {
              classHandler: function (el)
              {
                  return $(el).closest('.error-container');
              },
              errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
              errorElem: '<li></li>'
          }
      });

}

$.fn.populate_asset_employee_details = function (obj)
{
  try 
  {
      $.fn.assign_form();
      let data = JSON.parse(obj);

      $('#txt_assign_id').val(data.id);
      $('#dd_employee').val(data.assigned_to_id).change();
      $('#taken_date').flatpickr({ dateFormat: "d-M-Y" }).setDate(data.taken_date);
      $('#return_date').flatpickr({ dateFormat: "d-M-Y" }).setDate(data.return_date);
      $('#dd_assign_status').val(data.is_active).change();
      $('#txt_assign_remarks').val(data.remarks);

  }
  catch (err) 
  {
      $.fn.log_error(arguments.callee.caller, err.message);
  }
}

$.fn.populate_asset_employees_list = function (data)
{
  try 
  {
      $("#table_assign_list").empty();
      if (data.length > 0)
      {
          let row = '';
          for (let i = 0; i < data.length; i++)
          {
              let edit_row = '';
              if (MODULE_ACCESS.edit == 1)
              {
                  edit_row = `<button type="button" class="btn btn-xs btn_edit_payment" data-bs-toggle="tooltip" data-bs-placement="top" data-value="${ escape(JSON.stringify(data[i])) }" onclick="$.fn.populate_asset_employee_details(decodeURIComponent('${ escape(JSON.stringify(data[i])) }'))">
                          <i class="mdi mdi-square-edit-outline" style="font-size: 17px;"></i>
                      </button>`;
              }
              row = `<tr>
                          <td class='td-shrink'>
                              ${ edit_row }
                          </td>
                          <td>${ data[i].assigned_to }</td>
                          <td>${ data[i].taken_date != null ? moment(data[i].taken_date).format('D-MMM-YYYY') : '-' }</td>
                          <td>${ data[i].return_date != null ? moment(data[i].return_date).format('D-MMM-YYYY') : '-' }</td>
                          <td>${ data[i].is_active == 1 ? 'Active' : 'InActive' }</td>
                          <td>${ data[i].remarks }</td>
                      </tr>`

              $("#table_assign_list").append(row);

          }

      }
      else
      {
          $("#table_assign_list").append
              (
                  `<tr>
                  <td colspan="5">
                      <div class='list-placeholder'>No Records Found</div>
                  </td>
              </tr>`
              );
      }
  }
  catch (err) 
  {
      $.fn.log_error(arguments.callee.caller, err.message);
  }
};

$.fn.reset_search = function (no, remark, action)
{
  var newCondition = $("#dynamicContent .condition-row").clone();
  newCondition.find('.select2Plugin').select2();
  $("#detail_form").html(newCondition);

  $("#detail_form .condition-row:first .delete-condition").hide();

  $.fn.reset_validation();
};

$.fn.add_remove_delete = function ()
{
  var count = $("#detail_form .condition-row").length;
  if (count == 1)
  {
      $("#detail_form .condition-row:first .delete-condition").hide();
  }
  else
  {
      $("#detail_form .condition-row .delete-condition").show();
  }

};

$.fn.reset_validation = function ()
{
  $('#detail_form').parsley().destroy();
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
};

$.fn.create_drop_down = function (field)
{
  try
  {
      let data = drop_down_values;

      let employees = ['approved_by'
          , 'verified_by'
          , 'created_by'
          , 'assigned_to'
      ];

      let select_options;

      if ($.inArray(field, employees) !== -1)
      {
          select_options = data['data']['employees'];
      }
      else
      {
          select_options = data['data'][field];
      }

      let select_html = '<select class="form-control search-value select2Plugin" name="search_value">';

      $.each(select_options, function (id, value) 
      {
          select_html += '<option value="' + value['id'] + '">' + value['descr'] + '</option>';
      });

      select_html += '</select>';

      return select_html;
  }
  catch (err)
  {
      $.fn.log_error(arguments.callee.caller, err.message);
  }
};

$.fn.condition_drop_down = function (field)
{
  try
  {
      let select_conditions;
      if ($.inArray(field, fields_with_datepicker) !== -1 || $.inArray(field, fields_with_drop_down) !== -1)
      {
          select_conditions = ['='];
      }
      else if ($.inArray(field, fields_with_numbers) !== -1)
      {
          select_conditions = ['=', '<=', '>=', '<', '>'];
      }
      else
      {
          select_conditions = ['=', 'like'];
      }

      let select_html = '<select class="form-control search-condition select2Plugin" name="search_condition">';

      $.each(select_conditions, function (id, value) 
      {
          select_html += '<option value="' + value + '">' + value + '</option>';
      });

      select_html += '</select>';
      return select_html;
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
      $('#btn_new').click(function (e)
      {
          e.preventDefault();
          $.fn.show_hide_form('NEW');
          $('#tblList').hide();
          $.fn.populate_additional_list_form();
      });
      $('#btn_back,#btn_cancel').click(function (e)
      {
          e.preventDefault();
          $.fn.show_hide_form('BACK');
      });
      $('#btn_save').click(function (e)
      {
          e.preventDefault();
          btn_save = Ladda.create(this);
          btn_save.start();
          $.fn.save_edit_form();
      });

      $('#btn_reset').click(function (e)
      {
          e.preventDefault();
          $("#project_name_id").val("");
          $("#description_id").val("");
          // $.fn.reset_form();
          // $('#total_records').html('0');
          // $.fn.reset_search();
          RECORD_INDEX = 0;
          $.fn.get_list(false);
      });

      $('#btn_search').click(function (e)
      {
          e.preventDefault();
          if ($('#detail_form').parsley().validate() == false || $('#detail_form').parsley().validate() == null)
          {
              btn_save.stop();
              return;
          }
          RECORD_INDEX = 0;
          $.fn.get_list(false);
      });


      $('#btn_search_action').click(function ()
      {
          $('#searchPanel').show();
          $('#btn_search_action').hide();
      });

      $('#btn_close_search').click(function ()
      {
          $('#searchPanel').hide();
          $('#btn_search_action').show();
      });

      $('#btn_load_more').click(function (e)
      {
          e.preventDefault();
          $.fn.get_list(true);
      });

      $('#btn_warranty_save').click(function (e)
      {
          e.preventDefault();
          btn_warranty_save = Ladda.create(this);
          btn_warranty_save.start();
          $.fn.save_edit_warranty_form();
      });

      $('#btn_assign_cancel').click(function (e)
      {
          $('#new_assign_div').hide();
          $('#btn_new_access').show();
      });

      $('#btn_assign_save').click(function (e)
      {
          e.preventDefault();
          btn_assign_save = Ladda.create(this);
          btn_assign_save.start();
          $.fn.save_edit_assign_form();
      });

      $('body').on('change', '.search-field', function (e)
      {
          let current_value = $(this).val();
          let this_class = $(this);
          this_class.parents('.condition-row').find('.search-condition').remove();
          let select_condition = $.fn.condition_drop_down(current_value);
          this_class.parents('.condition-row').find('.conditionContainer').html(select_condition);

          if ($.inArray(current_value, fields_with_drop_down) !== -1)
          {
              let select_html = $.fn.create_drop_down(current_value);
              this_class.parents('.condition-row').find('.search-value').replaceWith(select_html);
          }
          else if ($.inArray(current_value, fields_with_datepicker) !== -1)
          {
              let input_html = `<div class="errorContainer">
                                      <input type="text" id="dp_search_date" class="form-control flatpickr-input search-value" placeholder="21-Sept-2021 to 20-Sept-2021" readonly="readonly">
                                  </div>
                                  <input type="hidden" class="date_range_value" name="search_value" id="date_range_value">`;

              this_class.parents('.condition-row').find('.search-value').replaceWith(input_html);

              this_class.parents('.condition-row').find('.search-value').flatpickr({
                  mode: "range",
                  altFormat: "d-M-Y",
                  dateFormat: "d-M-Y",
                  onChange: function (selectedDates)
                  {
                      var _this = this;
                      var dateArr = selectedDates.map(function (date) { return _this.formatDate(date, 'Y-m-d'); });
                      $('#date_range_value').val(dateArr[0] + '/' + dateArr[1]);

                  },
              });
          }
          else
          {
              let input_html = '<input class="form-control search-value" data-required="true" name="search_value">';
              this_class.parents('.condition-row').find('.search-value').replaceWith(input_html);

              if (current_value == 'overdue_tasks')
              {
                  this_class.parents('.condition-row').find('.search-condition, .search-value').attr('disabled', 'disabled');
              }
              else
              {
                  this_class.parents('.condition-row').find('.search-condition, .search-value').removeAttr('disabled');
              }
          }

          $.fn.reset_validation();

      });

      $('#add-condition').click(function (e)
      {
          e.preventDefault();
          var newCondition = $("#dynamicContent .condition-row").clone();
          newCondition.find('.select2Plugin').select2();
          newCondition.insertAfter("#detail_form .condition-row:last");

          $.fn.reset_validation();
          $.fn.add_remove_delete();
      });

      $('body').on('click', '.delete-condition', function (e)
      {
          $(this).parents('.condition-row').remove();
          $.fn.add_remove_delete();
      });

      $('body').on('change', '.search-field', function (e)
      {
          var current_value = $(this).val();
          var current_element = $(this);
          $('.search-field').not(this).each(function ()
          {
              if (current_value == $(this).val())
              {
                  current_element.select2("val", "");
              }
          });
      });

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
			"method": "get_master_dropdown_list",
			"data": {
				"key" : "S3RqblBGb1RETnVIMVptaWwxRmQxMVVUdUtRemFTTjgzVUQzTktLZEhHMD0=",
                "type": "customer",
                "client_id" : 1,
                "descr_code" : ""
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
						$.fn.show_right_error_noty('Something Went Wrong');
					}
					else
					{
                        $.each(data.data, function(key, value) {   
							$('#customerid').append($("<option></option>").attr("value", value.id).text(value.company_name)); 
					   	});
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

function exportTable2CSVAL(title,tableId){

  table.button( '.buttons-excel' ).trigger();


}

$.fn.edit_modal = function (data)
{
  try
  {
      $('#validationCustom01').val(data.project_name);
      $('#description').val(data.project_description);
      $('#amount').val(data.project_amount);
      $('#spend').val(data.project_spend);
      $('#type').val(data.project_type);
      $('#invoicedate').val(data.invoice_date);
      $('#fromdate').val(data.active_from_date);
      $('#todate').val(data.inactive_from_date);
      $('#customer_id').val(data.customer_id);
      $('#editid').val(data.id);

    $.fn.show_hide_form('EDIT');
    $('#tblList').hide();
    $.fn.populate_additional_list_form('EDIT')
    
  }
  catch (err)
  {
      $.fn.log_error(arguments.callee.caller, err.message);
  }
};

$.fn.view_modal = function (data)
{
  try
  {
      $('#nameid_v').html(data.project_name);
      $('#descriptionid_v').html(data.project_description);
      $('#amountid_v').html(data.project_amount);
      $('#sepndid_v').html(data.project_spend);
      $('#typeid_v').html(data.project_type);
      $('#invoiceid_v').html(data.invoice_date);
      $('#fromdateid_v').html(data.active_from_date);
      $('#todateid_v').html(data.inactive_from_date);
      $('#viewlistmodal').modal('show');
  }
  catch (err)
  {
      $.fn.log_error(arguments.callee.caller, err.message);
  }
};

$.fn.project_form = function (type,workId)
{
  try
  {
      let SESSIONS_DATA_F = $.jStorage.get('session_data');
      let paramFilter =
      {
        "token": SESSIONS_DATA_F.token,
        "method": "add_projects",
        "data": {
            "id" : $('#editid').val()||'',
            "name" : $('#validationCustom01').val()||'',
            "desc" : $('#description').val()||'',
            "amount":$('#amount').val()||'',
            "spend":$('#spend').val()||'',
            "type":$('#type').val()||'',
            "invoice_date":$('#invoicedate').val()||'',
            "from_date":$('#fromdate').val()||'',
            "to_date":$('#todate').val()||'',
            "customer_id":$('#customerid').val()||'',
            "json_field" : {},
            "user_id": SESSIONS_DATA.id,
            "client_id" : SESSIONS_DATA.client_id
                
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
                    $.fn.show_right_error_noty('Something Went Wrong');
                  }
                  else
                  {
                    $.fn.show_right_success_noty('Data has been submitted successfully');
                    $('#project_form_id').trigger("reset");
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

$.fn.generate_project_user_form_data = () => {
  let formData = [];

  // Iterate through each row in the dynamic fields
  $("#dynamic-forms > #dynamic-fields > .row").each(function (i,v) {
    if(i == 0) 
      return;
    const row = $(this);

    // Extract values from the form elements in the row
    const day = row.find(".col .day-selector").val();
    const user = row.find(".col .js-select2").val();
    const startTime = row.find(".col .timepicker[name^='start_time']").val();
    const endTime = row.find(".col .timepicker[name^='end_time']").val();

    // Create an object to store the data from this row
    const rowData = {
      id: "",
      work_days: day.join(),
      assign_user_id: user,
      start_time: startTime,
      end_time: endTime,
      start_break_time: endTime,
      end_break_time: endTime,
      json_field: {},
      is_active: 1,
    };

    // Push the rowData object into the formData array
    formData.push(rowData);
  });

  return formData

}

// ----------------------------- //
// New feature 
// @aginanjarm
// ----------------------------- //
// Add user on project

// Function to add a new input field

let fieldCount = 0; // Start with 0 to have only one default row
$.fn.addNewField = (data = '') => {

  fieldCount++;
  let form_type = '';

  if(data != '')
  {
    form_type = 'EDIT';
  }

  const newField = `
      <div class="row mb-2">
          <div class="col col-3">
              <select class="day-selector" name="day_${fieldCount}"></select>
              <ul id="dd_additional_error" class="help-block list-unstyled" style="display: none;">
                                <li class="required" style="display: list-item;">This value is required.</li></ul>
          </div>
          <div class="col col-2">
              <select class="js-select2 form-control" name="user_${fieldCount}">
                  <!-- Options will be added dynamically using Select2 AJAX -->
              </select>
              <ul id="dd_additional_error" class="help-block list-unstyled" style="display: none;">
                                <li class="required" style="display: list-item;">This value is required.</li></ul>
          </div>
          <div class="col">
              <input type="text" class="form-control timepicker" name="start_time_${fieldCount}"  placeholder="12:00">
              <ul id="dd_additional_error" class="help-block list-unstyled" style="display: none;">
                                <li class="required" style="display: list-item;">This value is required.</li></ul>
          </div>
          <div class="col">
              <input type="text" class="form-control timepicker" name="end_time_${fieldCount}"  placeholder="12:00">
              <ul id="dd_additional_error" class="help-block list-unstyled" style="display: none;">
                                <li class="required" style="display: list-item;">This value is required.</li></ul>
          </div>
          <div class="col">
              <input type="text" class="form-control timepicker" name="start_break_time_${fieldCount}"  placeholder="12:00">
              <ul id="dd_additional_error" class="help-block list-unstyled" style="display: none;">
                                <li class="required" style="display: list-item;">This value is required.</li></ul>
          </div>
          <div class="col">
              <input type="text" class="form-control timepicker" name="end_break_time_${fieldCount}"  placeholder="12:00">
              <input type="hidden" class="form-control" name="id_user_${fieldCount}" >
              <ul id="dd_additional_error" class="help-block list-unstyled" style="display: none;">
                                <li class="required" style="display: list-item;">This value is required.</li></ul>
          </div>
          <div class="col">
              <button type="button" class="btn btn-danger remove-field">x</button>
              ${true ? '<button type="button" class="btn btn-success" id="add-field">+</button>':''}

          </div>
      </div>
  `;
  

  $("#dynamic-fields").append(newField);
  

  // Reinitialize Select2 and timepicker for the new field
  $(".timepicker[name='start_time_" + fieldCount  + "']").flatpickr({
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true 
  });
  $(".timepicker[name='end_time_" + fieldCount  + "']").flatpickr({
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true 
  });
  $(".timepicker[name='start_break_time_" + fieldCount  + "']").flatpickr({
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true 
  });
  $(".timepicker[name='end_break_time_" + fieldCount  + "']").flatpickr({
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true 
  });

  // Initialize Selectize for day selection with custom options
  $.fn.initializeSelectize($(".day-selector[name='day_" + fieldCount + "']"), form_type, data);
  $.fn.initializeSelect2($(".js-select2[name='user_" + fieldCount + "']"), form_type, data);

  if(form_type == "EDIT")
  {
    $("[name='start_time_"+fieldCount+"']").val(data.work_start_time.slice(0, 5))
    $("[name='end_time_"+fieldCount+"']").val(data.work_end_time.slice(0, 5))
    $("[name='start_break_time_"+fieldCount+"']").val(data.break_start.slice(0, 5))
    $("[name='end_break_time_"+fieldCount+"']").val(data.break_end.slice(0, 5))
    $("[name='id_user_"+fieldCount+"']").val(data.id)
  }

  // Add change event handler for end time validation to the new field
  $(".timepicker[name='end_time_" + fieldCount  + "']").on("change", function () {
      validateEndTime(this);
  });

  // Sanitize the button
  $('.col > #add-field:not(:last)').remove();
};

// Initialize Select2 for user selection (single selection)
$.fn.initializeSelect2 = ($selectElement,form_type, data) =>{
    const paramFilter = {
        "token": SESSIONS_DATA.token, // Should dynamic token
        "method": "get_users_list",
        "data": {
            "id": "",
            "client_id": SESSIONS_DATA.client_id
        }
    }

    $selectElement.select2({
        ajax: {
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            quietMillis: 250,
            data: JSON.stringify(paramFilter),
            url: services_URL,
            processResults: function (response) {
                return {
                    results: $.map(response?.data?.list, function (user) {
                        return {
                            id: user.id,
                            text: user.name
                        };
                    })
                };
            }
        },
        multiple: false // Ensure single selection
        
    });

    if(form_type == 'EDIT')
    {

      $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        quietMillis: 250,
        data: JSON.stringify(paramFilter),
        url: services_URL,
      }).then(function (response) {
          // create the option and append to Select2
          const list = response?.data?.list
          let selected = undefined;
          for(const idx in list)
          {
            var option = new Option(list[idx].name, list[idx].id, true, true);
            $selectElement.append(option).trigger('change');
            if(list[idx].id == data.user_id) selected = list[idx]
          }
          
          // manually trigger the `select2:select` event
          $selectElement.select2().val(selected.id).trigger("change");
      });      

    }
}

// Function to initialize Selectize for day selection
$.fn.initializeSelectize = ($selectElement, form_type, data) =>{
    $selectElement.selectize({
        theme: 'links',
        maxItems: null,
        valueField: 'id',
        searchField: 'title',
        options: [
            { id: 1, title: 'Monday' },
            { id: 2, title: 'Tuesday' },
            { id: 3, title: 'Wednesday' },
            { id: 4, title: 'Thursday' },
            { id: 5, title: 'Friday' },
            { id: 6, title: 'Saturday' },
            { id: 7, title: 'Sunday' },
        ],
        render: {
            option: function (data, escape) {
                return '<div class="option">' +
                    '<span class="title">' + escape(data.title) + '</span>' +
                    '</div>';
            },
            item: function (data, escape) {
                return '<div class="item"><a href="' + escape(data.url) + '">' + escape(data.title) + '</a></div>';
            }
        },
        create: function (input) {
            return {
                id: 0,
                title: input,
            };
        }
    });

    if(form_type == 'EDIT')
    {

      if($selectElement.selectize)
      {
        $selectElement[0].selectize?.setValue(data?.work_days?.split(","))
      }

    }
}

$.fn.populate_additional_list_form = (form_type='') => {
  // Initialize timepicker
  $(".timepicker").flatpickr({
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true 
  });

  // Counter for field IDs
  const $addFieldButton = $("#add-field");

 // Add the initial row
  $("#dynamic-fields > .row:gt(0)").remove();

  if(form_type == '')
    $.fn.addNewField();

  $('.remove-field').hide();

  // Function to remove an input field
  const generate_edit_user_form = (element) => {
    const rowData = {
      "user_id": SESSIONS_DATA.id, // SESSIONS_DATA.id (current logged user)
      "client_id": 1,
      "project_id": $('#editid').val(),
      "user_data": []
    };

    // Clear the previous data
    rowData.user_data.length = 0;

    // Loop through each row in the container
    element.each(function () {
        // Create an object to store the data for this row
        const rowObject = {
          work_days: "",
          assign_user_id: "",
          start_time: "",
          end_time: "",
          start_break_time: "",
          end_break_time: "",
          id: "",
          json_field: {},
          is_active: "",
        };

        // Get the selected days
        const selectedDay = $(this).find(".col .day-selector").val();
        rowObject.work_days = selectedDay.join();

        // Get the selected user
        rowObject.assign_user_id = $(this).find("select[name^='user_']").val();

        rowObject.start_time = $(this).find("input[name^='start_time_']").val();
        rowObject.end_time = $(this).find("input[name^='end_time_']").val();
        rowObject.start_break_time = $(this).find("input[name^='start_break_time_']").val();
        rowObject.end_break_time = $(this).find("input[name^='end_break_time_']").val();
        rowObject.id = $(this).find("input[name^='id_user_']").val();
        rowObject.json_field = {};
        rowObject.is_active = 1;



        // Push the row object into the array
        rowData?.user_data?.push(rowObject);
    });

    return rowData;

  }

  $.fn.remove_field_action = () => {
    $("#dynamic-fields").on("click", ".remove-field", function () {

        const data = generate_edit_user_form($(this).closest(".row"))

        if(data?.user_data.id != "")
        {
          $.fn.write_data
          (
              $.fn.generate_parameter('add_users_to_projects', data),
              function (return_data)
              {
                console.log(return_data)
                $.fn.show_right_success_noty('Data has been recorded successfully');

              }, true, btn_save
          );
        }






        $(this).closest(".row").remove();
        
        $rowDynamicFields = $("#dynamic-fields .row").length;

        if ($rowDynamicFields > 2) {
          // Hide the "Remove" button for the first row
          $(".remove-field").show();
        } else {
          $(".remove-field").hide();

          $('.btn-success#add-field').length < 1 ? $addFieldButton.appendTo($("#dynamic-fields > .row:last > .col:last")) : "";
        }
    });
  }
  $.fn.remove_field_action();

  // Handle form submission
  $("#dynamic-form").submit(function (event) {
      event.preventDefault();
      const formData = $(this).serializeArray();
      // Send the data to the server or process it as needed
  });

  // Function to validate end date
  function validateEndTime(endDateInput) {
      const $endDateInput = $(endDateInput);
      const fieldId = $endDateInput.attr("name").split("_")[2];
      const startDateValue = $(".timepicker[name='start_time_" + fieldId  + "']").val();
      const endDateValue = $endDateInput.val();

      if (startDateValue && endDateValue) {
          if (startDateValue > endDateValue) {
              console.log("End Date cannot be less than Start Time.");
              $endDateInput.val(""); // Clear the invalid value
          }
      }
  }

 

  // Add click event to "Add Field" button
  $('body').on("click","#add-field",function () {
    $.fn.addNewField();
    $rowDynamicFields = $("#dynamic-fields .row").length;

    // Move the "Add Field" button to the last row
    $('.col > #add-field:not(:last)').remove();
    // $addFieldButton.appendTo($("#dynamic-fields > .row:last > .col:last"));
    $addFieldButton.removeClass("btn-primary").addClass("btn-success");

    $('.remove-field').show();
  });

  // Initialize Select2 and Selectize for the initial form fields
  $.fn.initializeSelect2($(".js-select2"));
  $.fn.initializeSelectize($(".day-selector"));
}

$(document).ready(function ()
{
  $.fn.reset_search();
  $.fn.set_filter_data();
  $.fn.form_load();
  
});


