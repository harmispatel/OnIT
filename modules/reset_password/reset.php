<?php
$current_path = "../../";
include $current_path . '../services/server.php';
include $current_path . "header-focused.php"

?>

<div class="verticalcenter">
	<a href="index.php"><img src="<?php echo $current_path ?>assets/img/logo-big.png" alt="Logo" class="brand" /></a>
	<div class="panel panel-primary">
		<div class="panel-body">
			<h4 class="text-center" style="margin-bottom: 25px;">Reset Password</h4>
				<form id="reset_form" data-validate="parsley" class="form-horizontal" style="margin-bottom: 0px !important;">
						
						<div class="form-group">
							<div class="col-sm-12">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-envelope-o"></i></span>
									<input type="text" class="form-control" id="txt_email" placeholder="Email" required="required">
								</div>
							</div>
						</div>
					</form>
					
		</div>
		<div class="panel-footer">
			<div class="pull-left">
				<a href="<?php echo $current_path ?>login.php" class="btn btn-default"><i class="fa fa-arrow-left"></i> Back</a>
			</div>
			<div class="pull-right">
				<button class="btn btn-success ladda-button" data-style="expand-left" data-spinner-color="#000000" id="btn_submit">Submit</button>
			</div>
		</div>
	</div>
 </div>
<?php 
echo include_js_files($current_path . 'assets/js/jquery-1.10.2.min.js');
echo include_js_files($current_path . 'assets/js/custom_js/core.js');
echo include_js_files($current_path . 'assets/plugins/ladda/dist/spin.min.js');
echo include_js_files($current_path . 'assets/plugins/ladda/dist/ladda.min.js');
echo include_js_files($current_path . 'assets/js/custom_js/jquery.blockUI.js');
echo include_js_files($current_path . "assets/plugins/form-parsley/parsley.min.js");
echo include_js_files($current_path . 'assets/plugins/pines-notify/jquery.pnotify.min.js');
echo include_js_files('reset.js');
?>      
</body>
</html>