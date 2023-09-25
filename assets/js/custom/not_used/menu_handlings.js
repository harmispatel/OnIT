/**
 * @author Jamal
 * @date 8-Apr-2012
 * @Note = Please do not apply Ctr-Alt-Format for better readable codes
 *         Please follow the indentation
 *         Please follow the naming convention
 */

 $(document).ready(function() 
 {
	 
  
  if ( $.jStorage.get('usertype')	== is_support)
       $.jStorage.set('userrole', Array(is_support));
  
  if ( $.jStorage.get('usertype')	== 'DNEX-CPM')
       $.jStorage.set('userrole', Array('DNEX-CPM'));
  
  if ( $.jStorage.get('usertype')	== 'DNEX-BCM')
       $.jStorage.set('userrole', Array('DNEX-BCM'));                
    
    var html_obj = $('<div><a class="pureCssMenui" href="#"><span>Settings</span><![if gt IE 6]></a><![endif]><!--[if lte IE 6]><table><tr><td><![endif]--> <ul class="pureCssMenum"></ul><div>');
    
    // show settings for dnt users
    if ( ['DNEX-BCM','DNEX-CPM','DNEX-SUPP'].indexOf($.jStorage.get('userrole'))  != -1 )       
        $('ul',html_obj).append('<li class="pureCssMenui" id="mn_profile_dnt"><a class="pureCssMenui" href="#">Organization List</a></li>');       
        
    if ( $.jStorage.get('userrole') ==  'DNEX-CPM' )    
        $('ul',html_obj).append('<li class="pureCssMenui" id="mn_networking_dnex"><a class="pureCssMenui" href="#">Business Network Management</a></li>');
               
    if ($.jStorage.get('usertype') == 'ORGADMIN' && $.jStorage.get('ogacode') === 'MIT')
        $('ul',html_obj).append('<li class="pureCssMenui" id="mn_profile_miti"><a class="pureCssMenui" href="#">Organization Details (MITI) </a></li> ');
        
    else if ($.jStorage.get('usertype') == 'ORGADMIN' && $.jStorage.get('ogacode') === null )
        $('ul',html_obj).append('<li class="pureCssMenui" id="mn_org_profile"><a class="pureCssMenui" href="#">Organization Details</a></li> ');
    
    if(  ['BRCHADMIN','BRANCHADMIN','ORGADMIN'].indexOf( $.jStorage.get('usertype') ) !=-1  && ( $.jStorage.get('ogacode') === '' )  )
    {                $('ul',html_obj).append('<li class="pureCssM enui" id="mn_networking"><a class="pureCssMenui" href="#">Business Networking</a></li> ');
        $('ul',html_obj).append('<li class="pureCssMenui" id="mn_applicant"><a class="pureCssMenui" href="#">Applicant Profile</a></li> ');
        $('ul',html_obj).append('<li class="pureCssMenui" id="mn_applicant_address"><a class="pureCssMenui" href="#">Applicant Address</a></li> ');
    }
        
    $('#menur').append(html_obj.html());    
    
    // if we got sumbmenu , we can confirm that its not normal user . So delete settings if he is normal user
    if ($('#menur ul li').length == 0)
        $('#menur').remove();
    else     
        $('#menur').show();
    
    $('#mn_home, #mn_nsw , #epco_main').show();
    
        
	//hide revert task & report menu for non oga users (MIT)	
	// if($.jStorage.get('usertype') != 'ORGADMIN') 	
		// $('#mn_revert_task').remove();
// 			
	// if($.jStorage.get('ogacode') != 'MIT')				
		// $('#mn_epco_report').remove();		
    // end section to load settings menu
   	   
	
	//HIDE FOR NON LIST USER
	$('#epco_main').hide();
	if( [ 'PCOIEUSR','PCOMITIADMIN','PCOMITIAPVR','PCOMITICLK','PCOMITIREC','PCOMITIVER','PCOMNFUSR','DNEX-SUPP' ].indexOf($.jStorage.get('userrole')) != -1 )
			$('#epco_main').show();
	
	
	
   	if ($('#mn_nsw_sub').length)	   			 
   		$('#mn_nsw_sub').hide();
   	
   	if ($('#mn_other_services_sub').length)	   			 
   		$('#mn_other_services_sub').hide();
   	      	  
   	
   	// START all top menu	
	$('#mn_home').click( function() 
   	{	   					   	
		$.fn.hide_all_sub();
		$('#mn_dashboard')	.show();
		$('#mn_dash_sub')	.show();
		$('#mn_home')		.addClass('form_topmenu_active');
	});
		
	$('#mn_nsw').click( function() 
   	{
   		$.fn.hide_all_sub();	   	
		$('#mn_nsw_sub')	.show();
		$('#mn_nsw')		.addClass('form_topmenu_active');				
				
   	});
   	
   	$('#mn_other_service').click(function() 
   	{   
   		$.fn.hide_all_sub();
	    $('#mn_other_services_sub')	.show();
		$('#mn_other_service')		.addClass('form_topmenu_active');
		
   	});
   	// END all top menu
	
	
	// START NSW SUB MENU 
	$('#mn_epco_dashboard').click( function() 
   	{	
   		$.fn.remove_menu_active_class();
   		$.fn.remove_sub_menu_active_class();
   		$('#mn_home')		.addClass('form_topmenu_active');
   		$('#mn_dash_sub')	.addClass('form_menu_active');
   		$.fn.load_form('../dnex_app/dashboard/epco/dashboard.html');
	});
	     	     
    $('#mn_epco').click( function() 
   	{	
   		$.fn.signout_application();
   		$.fn.remove_menu_active_class();
   		$.fn.remove_sub_menu_active_class();
   		$('#mn_nsw')	.addClass('form_topmenu_active');
   		$('#epco_main')	.addClass('form_menu_active');
   		$.fn.load_form('../dnex_app/nsw/epco/main_trans_list.html');
	});
	
	$('#mn_revert_task').click( function() 
   	{	   		
   		$.fn.load_form('../dnex_app/nsw/epco/revert_task/revert_task.html');
	});
			
	$('#mn_epco_report').click( function() 
   	{	
   		$.fn.remove_menu_active_class();
   		$.fn.remove_sub_menu_active_class();
   		$('#mn_nsw')	.addClass('form_topmenu_active');
   		$('#epco_main')	.addClass('form_menu_active');
   		$.fn.load_form('../dnex_app/nsw/epco/reports/reports_main.html');
	});
         
  	$('#mn_epayment').click(function() 
    { 
    	$.fn.remove_menu_active_class();
   		$.fn.remove_sub_menu_active_class(); 
   		$('#mn_nsw')		.addClass('form_topmenu_active');
   		$('#mn_epayment')	.addClass('form_menu_active');
   		$.fn.load_form('../dnex_app/nsw/emanifest/bl/ocean/ems_obl_listing.html');
	});	
	// END NSW SUB MENU
	
	// START OF OTHER SERVICES
	// END OF OTHER SERVICES
	
		
	// START OF SETTINGS		
	$('#mn_vessel_profile').click( function() 
   	{	
   		$.fn.remove_menu_active_class();
   		$.fn.remove_sub_menu_active_class();   		
   		$.fn.load_form('../dnex_app/nsw/emanifest/maintenance/vessels/frm_vessel_profile.html');
	});
		
	$('#mn_profile_dnt').live('click', function() 
    {   
        $.fn.remove_menu_active_class();
        $.fn.remove_sub_menu_active_class(); 
        $('#mn_home').addClass('form_topmenu_active');
        $.fn.load_form('../dnex_app/maintenance/administration/org_list.html');                                          
    }); 
	
	$('#mn_org_profile').live('click', function() 
    {   
        $.fn.remove_menu_active_class();
        $.fn.remove_sub_menu_active_class(); 
        $('#mn_home').addClass('form_topmenu_active');
        $.fn.load_form('../dnex_app/maintenance/administration/org_profile.html');  
        
    });
    
    $('#mn_profile_branch').live('click', function() 
    {   
        $.fn.remove_menu_active_class();
        $.fn.remove_sub_menu_active_class(); 
        $('#mn_home').addClass('form_topmenu_active');
        $.fn.load_form('../dnex_app/maintenance/administration/branch.html');                                         
    });
    
	$('#mn_profile_miti').live('click', function() 
    {   
        $.fn.remove_menu_active_class();
        $.fn.remove_sub_menu_active_class();
        $('#mn_home').addClass('form_topmenu_active'); 
        $.fn.load_form('../dnex_app/maintenance/administration/org_profile_miti.html');	        	                	        	    
    }); 


	$('#mn_networking').live('click', function() 
   	{	
   		$.fn.remove_menu_active_class();
   		$.fn.remove_sub_menu_active_class(); 
   		$('#mn_home').addClass('form_topmenu_active');  		
   		$.fn.load_form('../dnex_app/maintenance/networking/networking.html');
   		
	});	
	$('#mn_networking_dnex').live('click', function() 
    {   
        $.fn.remove_menu_active_class();
        $.fn.remove_sub_menu_active_class();        
        $('#mn_home').addClass('form_topmenu_active');
        $.fn.load_form('../dnex_app/maintenance/networking/networking_dnetx.html');
    }); 
    
    $('#mn_applicant').live('click', function() 
    {   
        $.fn.remove_menu_active_class();
        $.fn.remove_sub_menu_active_class();        
        $('#mn_home').addClass('form_topmenu_active');
        $.fn.load_form('../dnex_app/maintenance/applicant/applicant.html');
    }); 
    
    $('#mn_applicant_address').live('click', function() 
    {   
        $.fn.remove_menu_active_class();
        $.fn.remove_sub_menu_active_class();        
        $('#mn_home').addClass('form_topmenu_active');
        $.fn.load_form('../dnex_app/maintenance/address/mn_address.html');
    });	     
	// END OF SETTINGS
	
		
	$('#mn_signout').click(function()
	{	   		
	   jConfirm($.i18n.prop('msg_signout'), $.jStorage.get('app_name'), function(r) 
	   {			    
		    if(r == true)
		    {	
		    	$.fn.signout_application();			
				$.fn.user_logout();				
			}			
	   });	
   	});
	
	//default set home as active
	$('#mn_home')		.trigger('click');
   	$('#mn_dash_sub')	.addClass('form_menu_active');
});


$.fn.hide_all_sub = function()
{
	$('#mn_nsw_sub')			.hide();
	$('#mn_other_services_sub')	.hide();
	$('#mn_dashboard')			.hide();
	$.fn.remove_menu_active_class();	
}

$.fn.remove_menu_active_class = function ()
{	
	$('#mn_home')			.removeClass('form_topmenu_active');
	$('#mn_nsw')			.removeClass('form_topmenu_active');
	$('#mn_other_service')	.removeClass('form_topmenu_active');
}

$.fn.remove_sub_menu_active_class = function()
{	
	$('#mn_epermit_sta')	.removeClass('form_menu_active');
	$('#mn_epermit')		.removeClass('form_menu_active');
	$('#mn_emanifest')		.removeClass('form_menu_active');
	$('#mn_edeclare')		.removeClass('form_menu_active');
	$('#epco_main')			.removeClass('form_menu_active');
	$('#mn_epayment')		.removeClass('form_menu_active');		
}

