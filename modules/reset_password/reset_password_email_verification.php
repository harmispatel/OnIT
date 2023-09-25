<?php
$current_path = "../../";
//CHANGE PATH
require_once $current_path . '../services/server.php';
include constant('MODULES_DIR') . '/login.php';


// include_once '../../transporter.php';


    $param = json_encode($data = array
    (
        'email'     => stripslashes($_REQUEST['email']),
        'secret_key'=> stripslashes($_REQUEST['secret_key'])
    ));
    
    $result = json_decode(reset_password(json_decode($param)));
    
    if($result->code == 0)
    {
        $name       = 'Hi ' . $result->data->name . ',';
        $msg        = 'Your password has been reset, this is your new password <br/><br/><b>' . $result->data->password . '</b> <br/><br/>Please enter this password to proceed and change the password from within the system.';
    }
    else
    {
        $name       = 'Invalid user'; 
        $msg        = 'Your credentials is invalid';  
    }
    
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title><?php echo(constant('APPLICATION_TITLE')); ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <style type="text/css">
	/* CLIENT-SPECIFIC STYLES */
    #outlook a{padding:0;} /* Force Outlook to provide a "view in browser" message */
    .ReadMsgBody{width:100%;} .ExternalClass{width:100%;} /* Force Hotmail to display emails at full width */
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;} /* Force Hotmail to display normal line spacing */
    body, table, td, a{-webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;} /* Prevent WebKit and Windows mobile changing default text sizes */
    table, td{mso-table-lspace:0pt; mso-table-rspace:0pt;} /* Remove spacing between tables in Outlook 2007 and up */
    img{-ms-interpolation-mode:bicubic;} /* Allow smoother rendering of resized image in Internet Explorer */
    /* RESET STYLES */
    body{margin:0; padding:0;}
    img{border:0; height:auto; line-height:100%; outline:none; text-decoration:none;}
    table{border-collapse:collapse !important;}
    body{height:100% !important; margin:0; padding:0; width:100% !important;}
    /* iOS BLUE LINKS */
    .appleBody a {color:#68440a; text-decoration: none;}
    .appleFooter a {color:#999999; text-decoration: none;}
    /* MOBILE STYLES */
    @media screen and (max-width: 480px) {
                 .table_shrink {
            width:95% !important;
        }
    }
    </style>
</head>

<body>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFFFFF" class="table_shrink" align="center">
        <tr>
            <td>
                <!-- start body module -->

                <table width="520px" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" class="table_shrink" align="center">
                    <!-- start headline -->

                    <tr>
                        <td valign="top" style="padding-top: 30px; font-family:Helvetica neue, Helvetica, Arial, Verdana, sans-serif; color: #205081; font-size: 20px; line-height: 32px; text-align:left; font-weight:bold;" align="left">Password Reset</td>
                    </tr><!-- end headline -->

                    <tr>
                        <td style="color:#cccccc; padding-top:10px;" valign="top" width="100%">
                            <hr color="#CCCCCC" size="1">
                        </td>
                    </tr><!-- start headline -->
                    <!-- end headline -->
                    <!-- start copy -->

                    <tr>
                        <td valign="top" style="padding-top: 20px; font-family: Helvetica, Helvetica neue, Arial, Verdana, sans-serif; color: #333333; font-size: 14px; line-height: 20px; text-align:left; font-weight:none;" align="left">
                           <?php echo $name; ?>
                        </td>
                    </tr>

                    <tr>
                        <td valign="top" style="padding-top: 10px; font-family: Helvetica, Helvetica neue, Arial, Verdana, sans-serif; color: #333333; font-size: 14px; line-height: 20px; text-align:left; font-weight:none;" align="left">
                            <?php echo $msg; ?>
                            <br>
                        </td>
                    </tr>
                    
                    <tr>
                        <td valign="top" style="padding-top: 0px; font-family: Helvetica, Helvetica neue, Arial, Verdana, sans-serif; color: #333333; font-size: 14px; line-height: 20px; text-align:left; font-weight:none;" align="left">
                        Thank you,<br>
                        We wish you a good day ahead!
                        <br/><br/><br/>
                        Regards,
                        <br/>
                        <?php echo constant('MAIL_SIGNATURE') ?>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="color:#cccccc; padding-top:10px;" valign="top" width="100%">
                            <hr color="#CCCCCC" size="1">
                        </td>
                    </tr><!-- start headline -->
                    
                    <tr>
                        <td>
                            <table width="520px" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF" class="table_shrink" align="center">
                                <tr>
                                    <td valign="top" style="padding-top: 10px; font-family: Helvetica, Helvetica neue, Arial, Verdana, sans-serif; color: #707070; font-size: 12px; line-height: 18px; text-align:left; font-weight:none;" align="left">
                                    
                                    Powered by <?php echo constant('POWERED_BY') ?><br></td>

                                    <td align="right" style="padding-top:15px; padding-bottom:30px;">
                                    
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table><!-- end body module -->
            </td>
        </tr>
        
        
        
    </table>
</body>
</html>