<?php

    include ('../../../../../configuration_w/mabd.php');
    require('../../../../../configuration_w/tcpdf-master/tcpdf.php');
     $numposeidon= $_GET['numposeidon'] ;



     $rq = pg_query($conn,"SELECT \"NOM\",\"PRE\",\"FON\",\"MAT\",\"COD\",\"DJ1\",\"CRE\" FROM public.pos_tab_index_hsu WHERE \"NUD\"='".$numposeidon."'  ");

     $nom='';
     $prenom='';
     $fonction='';
     $matricule='';
     $code='';
     $htotal='';
     $createur='';
      while ($row = pg_fetch_row($rq)) {
        // as a string 
         $nom=$row[0];
         $prenom=$row[1];
         $fonction=$row[2];
         $matricule=$row[3];
         $code=$row[4];
         $htotal=$row[5];
         $createur=strtolower($row[6]);
     }

   
     $output_tab1='';

     $rq_tab1 = pg_query($conn,"SELECT date_crea,hdeb,hfin,nbrehreal,motif,montant,ferie FROM public.tab_hsu WHERE code='".$code."'  ");

        while ($row_tab1 = pg_fetch_row($rq_tab1)) {

            $output_tab1 .='
            <tr width="100%" >
                    <td width="12%" align="center">'.$row_tab1[0].'</td >
                    <td width="15%">'.$row_tab1[1].'</td >
                    <td width="15%" align="center">'.$row_tab1[2].' </td>
                    <td width="28%" align="center"> '.$row_tab1[3].'</td>
                    <td width="30%" align="center">'.$row_tab1[4].'</td>
            </tr>
     	  ';
            
        }

     
     
     
     // Extend the TCPDF class to create custom Header and Footer
class PDF extends TCPDF {
   
    //Page header
    
    // Page footer
    /*public function Footer() {
        // Position at 15 mm from bottom
        $this->SetY(-15);
        // Set font
        $this->SetFont('helvetica', 'I', 8);
        // Page number
        $this->Cell(0, 10, 'Page '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
    } */
}
// create new PDF document
$pdf = new PDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetCreator('IBSON');

$pdf->SetTitle('heures suppl??mentaires');

//supprime les lignes au dessus
$pdf->setPrintHeader(false);


$pdf->setPrintFooter(false);
 
// set default header data
/*
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 001', PDF_HEADER_STRING, array(0,64,255), array(0,64,128));*/


//$pdf->setFooterData(array(0,64,0), array(0,64,128));

// set header and footer fonts
//$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
//$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT,20, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
//$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);


// ---------------------------------------------------------

// set default font subsetting mode
$pdf->setFontSubsetting(true);

// Set font
// dejavusans is a UTF-8 Unicode font, if you only need to
// print standard ASCII chars, you can use core fonts like
// helvetica or times to reduce file size.
$pdf->SetFont('dejavusans', '', 11, '', true);

//header

 

$pdf->AddPage();

//BEGIN HEADER NO REPEAT ON PAGE
$image_file =K_PATH_IMAGES.'ngser.jpg';
        $pdf->Image($image_file, 10, 10, 40, '', 'JPG', '', 'T', false, 300, '', false, false, 0, false, false, false);
 $pdf->Ln(20);



 
 $html2 = '
<!-- CSS STYLE -->
<style>
   .arrowRight {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
}

</style>
<!-- <END CSS STYLE -->

<!-- BEGIN CONTENT -->

<br/>

<h1 class="entete" > <u STYLE="font-family: Century Gothic; " style="font-size:15pt"> Formulaire d???enregistrement d???Heures Suppl??mentaires </u> </h1>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;<br/>

    <table border="0" width="100%" style="font-family: Century Gothic; font-size:11pt; " >
        <tr>
            <td>
                <b>  Renseignements sur l???agent ayant effectu?? les heures suppl??mentaires</b>
            </td>
        </tr>
    </table>
<br/>
<br/>
    <table border="1" align="center" width="100%" STYLE="font-family: Century Gothic; font-size:11pt; ">
                        
        <tr width="100%" align="center"  >
            <td width="15%" align="center">NOM</td>
            <td width="35%" class="td1">'.$nom.'</td >
            <td width="15%" align="center">Pr??noms</td>
            <td width="35%" align="center" class="td1">'.$prenom.'</td>
        </tr>
        <tr width="100%" align="center">
            <td width="15%" align="center">Matricule</td>
            <td width="35%" class="td1">'.$matricule.'</td >
            <td width="15%" align="center">Service</td>
            <td width="35%" align="center" class="td1">'.$fonction.'</td>
        </tr>
                                      
    </table>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;<br/>       
    <table border="0" width="100%" style="font-family: Century Gothic; font-size:11pt; " >
        <tr>
            <td>
                <b>Informations sur les heures r??alis??es</b>
            </td>
        </tr>
    </table>
<br/>
<br/>
    <table border="1" align="center" width="100%" STYLE="font-family: Century Gothic; font-size:11pt; ">
        <tr width="100%" align="center"  bgcolor="#d6d3d3">
            <td width="12%" align="center" >Date</td>
            <td width="15%" align="center">Heure de d??but</td>
            <td width="15%" align="center">Heure de fin</td>
            <td width="28%" align="center">Nb Heures r??alis??es</td>
            <td width="30%" align="center">Motif</td>
        </tr>
        '.$output_tab1.'
        <tr width="100%" >
            <td width="42%" align="center"><b>Total heures suppl??mentaires</b></td >
            <td width="58%" align="center">'.$htotal.'</td>
        </tr>
        <tr width="100%" align="center"  bgcolor="#d6d3d3">
            <td width="100%" colspan="4" align="center" >Validation Manager</td> 
        </tr>
        <tr width="100%" >
            <td width="12%" align="center" >Date</td>
            <td width="30%" align="center">NOM</td>
            <td width="28%" align="center">Pr??noms</td>
            <td width="30%" align="center">Signature</td>
        </tr> 
        <tr width="100%" >
            <td width="12%" align="center"> </td >
            <td width="30%"> </td >
            <td width="28%" align="center"> </td>
            <td width="30%" align="center"> </td>
        </tr> 
    </table>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;<br/>
    <table border="1" align="center" width="100%" STYLE="font-family: Century Gothic; font-size:11pt; ">
        <tr width="100%" >
            <td width="40%" rowspan="3" colspan="2"  >
                <b>Nombre d???heures suppl??mentaires ?? payer</b>  
                ?? inscrire dans les compteurs de <br/> paiement d???heures suppl??mentaires
            </td>
            <td width="40%"  >de jour(7h ?? 21h) HSJ</td>
            <td width="20%" align="center" > </td>
        </tr> 
        <tr width="100%" >
            <td width="40%"  >de nuit(21h ?? 7h) HSN</td>
            <td width="20%" align="center" > </td>
        </tr>
        <tr width="100%" colspan="1" >
            <td width="40%"  >de dimanche et de jour f??ri??(7h ?? 21h) HSD</td>
            <td width="20%" align="center" > </td>
        </tr>
        <tr width="100%" >
            <td width="100%" colspan="4" align="center" bgcolor="#d6d3d3" >
                Accord de la direction
            </td>
        </tr>
        <tr width="100%" align="center"  >
            <td width="10%" align="center">Date</td>
            <td width="30%" align="center">NOM</td>
            <td width="40%" align="center">Pr??noms</td>
            <td width="20%" align="center">Signature</td>
        </tr>
        <tr width="100%" align="center"  >
            <td width="10%" align="center"> </td>
            <td width="30%" align="center"> </td>
            <td width="40%" align="center"> </td>
            <td width="20%" align="center"> </td>
        </tr>
    </table>
&nbsp;&nbsp;<br/>
&nbsp;&nbsp;<br/>
    <table border="0" width="100%" style="font-family: Century Gothic; font-size:11pt; " >
            <tr>
                <td>
                    <u>Destination du formulaire : </u>
                </td>
            </tr>
            <tr>
                <td>  
                     L???original du formulaire, rempli, doit &#234;tre adress?? au service des Ressources Humaines (au plus tard 30 jours apr&#232;s la date de r??alisation des heures suppl??mentaires).
                    </td>
                </tr>
            </table>



<!-- END CONTENT -->
'; 
$pdf->writeHTMLCell(0, 0, '', '',$html2, 0, 1, 0, true, '', true);

$pdf->Output('heuresup.pdf', 'I');

//============================================================+
// END OF FILE
//============================================================+


      


?>