<?php
  
// Send Headers   
    session_start();    
    include ('../../../../../configuration_w/mabd.php');
    require('../../../../../configuration_w/tcpdf-master/tcpdf.php');

     $numposeidon= $_GET['numposeidon'] ;
     $email= $_GET['email'] ;

      
     // Extend the TCPDF class to create custom Header and Footer
class PDF extends TCPDF {

    //Page header
    
    // Page footer
    public function Footer() {
        // Position at 15 mm from bottom
        $this->SetY(-15);
        // Set font
        $this->SetFont('helvetica', 'I', 8);
        // Page number
        $this->Cell(0, 10, 'Page '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
    }
}
// create new PDF document
$pdf = new PDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetCreator('IBSON');

$pdf->SetTitle('CDD avec essai');

//supprime les lignes au dessus
$pdf->setPrintHeader(false);


$pdf->setPrintFooter(true);
 
// set default header data
/*
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 001', PDF_HEADER_STRING, array(0,64,255), array(0,64,128));*/
$pdf->setFooterData(array(0,64,0), array(0,64,128));

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


///////////////////////////////DEBUT TRAITEMENT DES DONNEES ET VARIABLES //////////////////////////////////////

                        /****************DEBUT PERSONNEL *************************/
  $query_prs =" SELECT  \"CIV\",\"NOM\",\"PRE\",\"DNS\",\"LNS\",\"NTP\",\"NPI\",\"CNE\"
   FROM public.pos_tab_index_prs WHERE  \"MEL\" ='".strtolower($email)."'";
      $contests_prs = pg_query($query_prs) or die('Query failed: ' . pg_last_error());
     
   // $civ='';
    $civilite='';
    $nom='';
    $prenoms='';
    $datenaiss='';
    $lieunaiss='';
    $natpiece='';
    $libellepiece='';
    $numpiece='';
    $domicile='';

  
      while ($row_prs = pg_fetch_row($contests_prs)) {

        $civ=$row_prs[0];
        $nom=$row_prs[1];
        $prenoms=$row_prs[2];
        $datenaiss=$row_prs[3];
        $lieunaiss=$row_prs[4];
        $natpiece=$row_prs[5];
        $numpiece=$row_prs[6];
        $domicile=$row_prs[7];

      }

      $determinant='la';
       $majdeterminant='La';
      $accord='e';
      $pronom='elle';
      $majpronom='Elle';
     if($civ=='M'){
        $civilite='Monsieur';

        $determinant='le';
        $majdeterminant='Le';
        $accord='';
        $pronom='il';

        $majpronom='Il';
     }
     if($civ=='MME') {
           $civilite='Madame';
     }
     if ($civ=='MLLE') {
       $civilite='Mademoiselle';
     } 

     if($natpiece=='ATTESTATION'){
        $libellepiece='de l\'Attestation d\'Identit??';
     }
     if($natpiece=='CNI') {
           $libellepiece='de la Carte Nationale d\'Identit??';
     }
     if ($natpiece=='PERMIS DE CONDUIRE') {
       $libellepiece='du Permis de Conduire';
     } 
     if ($natpiece=='PASSEPORT') {
       $libellepiece='du Passeport';
     }
     if ($natpiece=='CARTE CONSULAIRE') {
       $libellepiece='de la Carte Consulaire';
     }  


                        /****************FIN PERSONNEL *************************/

                         /****************DEBUT CONTRAT *************************/
 
           $fonction=''; //FON
           $duree_mois=''; //MOI
           $duree_lettre=''; //M1
           $date_deb_contrat=''; //DDT
           $date_fin_contrat='';  //DEC
           $salaire_lettre='';  //MDT
           $salaire='';  //SAL
           $date_signature=''; //DSG
           $date_deb_essai='';//DEI
           $date_fin_essai='';//DFI
           $duree_mois_essai=''; //DRU
           $duree_lettre_essai=''; //DLA
           $avantage=''; //COM
 

          $query_cot ="SELECT  \"FON\",\"MOI\",\"M1\",\"DDT\",\"DEC\",\"MDT\",\"SAL\",\"DSG\",\"DEI\",\"DFI\",\"DRU\",\"DLA\",\"COM\"
   FROM public.pos_tab_index_cot WHERE  \"NUD\" ='".$numposeidon."'";
      $contests_cot = pg_query($query_cot) or die('Query failed: ' . pg_last_error());

        while ($row_cot = pg_fetch_row($contests_cot)) {
   
             $fonction=$row_cot[0];
             $duree_mois=$row_cot[1];
             $duree_lettre=$row_cot[2];
             $date_deb_contrat=$row_cot[3];
             $date_fin_contrat=$row_cot[4];
             $salaire_lettre=$row_cot[5];
             $salaire=str_replace(',','.',number_format($row_cot[6]) );
             $date_signature=$row_cot[7];
             $date_deb_essai=$row_cot[8];
             $date_fin_essai=$row_cot[9];
             $duree_mois_essai=$row_cot[10];
             $duree_lettre_essai=$row_cot[11];
             $avantage=$row_cot[12];

        }
 

                        /****************FIN CONTRAT *************************/
 
///////////////////////////////FIN TRAITEMENT DES DONNEES ET VARIABLES //////////////////////////////////////


                        //echo htmlspecialchars(utf8_encode($avantage) ) ;


//exit;

$pdf->AddPage();

//BEGIN HEADER NO REPEAT ON PAGE
 $image_file =K_PATH_IMAGES.'ngser.jpg';
        $pdf->Image($image_file, 10, 10, 40, '', 'JPG', '', 'T', false, 300, '', false, false, 0, false, false, false);

 $pdf->Ln(20);


 $html2 = '';
 
 $html2 .= '
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
<!-- HEADER -->

<table border="1" width="100%" align="center" style="margin-left:50%" valign="top" >
  <tr style="background-color:#C3C3C3;color:black;margin-left:12px; text-align:center;">

    <td width="100%"  style="text-align:center; vertical-align:top;" rowspan="2">

      <span  style="border-top: 1px solid black;"> <b>CONTRAT DE TRAVAIL A DUREE DETERMINEE</b></span> 
    </td>
  </tr>
</table>

<!-- HEADER -->


<!-- BEGIN CONTENT -->
<p>
<b>Entre : </b> <br/>
       <b>Nouvelle G??n??ration de Services en abr??g?? NGSER,</b>
</p>
Soci??t?? ?? Responsabilit?? Limit??e, sise ?? Abidjan-plateau, Avenue Lambin , Immeuble  MATCA, 4e Etage, immatricul??e au registre du commerce et du cr??dit mobilier sous le num??ro CI- ABJ-03-2020-M-11141 , 28 BP 722 Abidjan 28, t??l??phone (225) 20 22 12 53, repr??sent??e par le g??rant, <b>Monsieur ELLEPO S??bastien,</b> d??ment habilit?? aux fins des pr??sentes;
</p>
<p>
Ci-apr??s d??sign??e par <b>?? l???employeur ou NGSER ??</b>
</p>

<p>
<b>D???une part </b>
</p>

<p>
<b>Et </b>
</p>

<p>
<b>'.$civilite.' '.$nom.' '.$prenoms.' </b>n??'.$accord.' le '.$datenaiss.' ?? '.$lieunaiss.' titulaire '.$libellepiece.' num??ro '.$numpiece.', domicili?? ?? '.$domicile.', ayant tous pouvoirs ?? l???effet des pr??sentes, 
</p>

<p>
NGSER et '.$determinant.' salari??'.$accord.' ??tant individuellement d??sign??s <b>?? la partie ??</b> et ensemble 
<b>?? les parties ??</b> 

</p>

<p>
<b>D???autre part</b>
</p>

<p>
NGSER et '.$determinant.' salari?? ??tant individuellement d??sign??s <b>?? la partie ??</b> et ensemble 
<b>?? les parties ??</b>

</p>

<p>
<b> <u>IL A ETE PREALABLEMENT EXPOSE CE QUI SUIT :</u></b>
</p>

<p>
<b>Vu le d??cret n?? 96-195 du 07 Mars 1996 et l???article 14.5 de la loi n?? 2015-532 du 20 Juillet 2015 portant code du travail,</b> ce pr??sent contrat de travail ?? dur??e d??termin??e comporte une p??riode d???essai. 
</p>

<p>
Ce contrat pr??sente des int??r??ts aussi bien pour l???employeur que pour '.$determinant.' salari??'.$accord.'.
</p>

<p>
S???agissant de l???employeur, la p??riode d???essai est l???occasion de porter un jugement de valeur, mieux ??clair?? et objectif, sur les comp??tences et les aptitudes professionnelles du travailleur ?? exercer l???emploi ?? lui offert.
</p>

<p>
Quant au salari??, cette p??riode probatoire le mettra en mesure d???appr??cier si la t??che qui lui est confi??e ainsi que les conditions dans lesquelles elle est accomplie lui conviennent ou non.
</p>

<p>
Dans l???hypoth??se o?? l???essai est satisfaisant de part et d???autre, '.$determinant.' salari??'.$accord.' est d??finitivement engag??'.$accord.'. Dans le cas contraire, chacune des parties au contrat reprendra sa libert??, sans aucune formalit?? et sans que la responsabilit?? de l???une ou de l???autre soit engag??e.
</p>

 <p>
<b><u>CECI EXPOSE, IL EST CONVENU CE QUI SUIT </u></b>
</p>

<p>
<b>ARTICLE 1 : OBJET </b>
</p>

<p>
Par ce contrat, la soci??t?? NGSER sollicite <b>'.$civilite.' '.$nom.' '.$prenoms.' </b>  qui accepte d???ex??cuter une prestation intellectuelle en qualit?? de <b>'.strtoupper($fonction).'</b>, dans le cadre d???un contrat de travail ?? dur??e d??termin??e,  conform??ment ?? sa fiche de poste annex?? au pr??sent contrat. '.$majpronom.' exercera ses fonctions sous l???autorit?? et selon les directives de l???employeur ?? qui il rendra compte de ses prestations de travail.
</p>

<p>
<b>ARTICLE 2 : OBLIGATIONS DE L???EMPLOYE'.strtoupper($accord).'</b>
</p>

<p>
Dans le cadre de ses fonctions, '.$determinant.' salari??'.$accord.' s???engage ?? : 
</p>

<p>
- Ex??cuter personnellement la prestation de travail avec soin, conform??ment aux normes et qualit??s requises dans son domaine d???activit?? ;
</p>
<p>
- Respecter le r??glement int??rieur de la soci??t?? NGSER ;
</p>

<p>
- Travailler sous les ordres et la direction de l???employeur ;
</p>

<p>
- Servir dans les locaux de NGSER ou en tout autre lieu en fonction des n??cessit??s du service ;
</p>

<p>
- Prendre soin du mat??riel de travail et garder le secret professionnel conform??ment ?? la clause de confidentialit?? ci-dessous ;
</p>
<p>
- Etre ponctuel et ex??cuter la prestation de travail conform??ment aux   horaires de travail applicable chez l???employeur ;
</p>
<p>
- Travailler avec abn??gation et loyaut?? au succ??s de l???employeur ;
</p>
<p>
- Respecter la l??gislation du travail.
</p>
 

<p>
<b>ARTICLE 3 : OBLIGATIONS DE L???EMPLOYEUR</b>
</p>
<p>
L???employeur s???engage ?? :
</p>

<p>
- Assurer ?? l???employ??'.$accord.' les conditions favorables de travail ;
</p>
<p>
- Procurer ?? l???employ??'.$accord.' le travail convenu au lieu convenu et lui payer son salaire. Toutefois, en cas d???urgence ou de p??ril et pour une t??che temporaire, l???employeur peut exiger du salari??'.$accord.' un travail autre que celui pr??vu au  contrat. Dans ces conditions, toute modification substantielle du contrat de travail requiert l???accord pr??alable du salari??'.$accord.'.
</p>
<p>
- Respecter la l??gislation du travail.
</p>

<p>
<b>ARTICLE 4 : REMUNERATION</b>
</p>
<p>
La r??mun??ration mensuelle nette de l???employ??'.$accord.' est fix??e ?? <b>'.strtolower($salaire_lettre).' ('.$salaire.') FCFA. </b>  
</p>

<p>
La r??mun??ration lui sera r??guli??rement vers??e dans un d??lai de huit (8) jours au plus tard, apr??s la fin du mois ouvrant droit au salaire par : 
</p>
<p>
- Virement bancaire ; 
</p>
<p>
- Ch??que ; ou
</p>
<p>
- En esp??ces.
</p>

 <p>
<b>ARTICLE 5 : DUREE</b>
</p>

<p>
Ce contrat est conclu pour une dur??e de '.$duree_lettre.' ('.$duree_mois.') mois, ?? compter du '.$date_deb_contrat.'  au '.$date_fin_contrat.'.
</p>

<p>
Il est assorti d???une p??riode d???essai d???une dur??e de '.$duree_lettre_essai.' ('.$duree_mois_essai.') mois, qui d??bute le '.$date_deb_essai.'  et expire le '.$date_fin_essai.', pr??alable ?? l???engagement d??finitif du salari??'.$accord.'. 
</p>

<p>
Le renouvellement de la p??riode d???essai d??cid?? par l???employeur sera notifi?? ?? l???employ??'.$accord.' par ??crit.
</p>

<p>
Au terme de cet essai, il pourra ??tre r??sili?? s???il n???est pas satisfaisant.
</p>

<p>
Si ?? l???expiration de la p??riode probatoire susvis??e, l???employeur est satisfait des comp??tences et des aptitudes professionnelles du salari??'.$accord.', celui-ci sera alors d??finitivement engag??. Dans ces conditions, '.$determinant.' salari??'.$accord.' pourra b??n??ficier de tous les privil??ges auxquels un employ?? a droit, conform??ment ?? la l??gislation du travail. 
</p>



<p>
<b>ARTICLE 6 : DROITS ET POUVOIRS DE L???EMPLOYEUR</b>
</p>
<p>
L???employeur a droit au respect scrupuleux de sa personne, de son int??grit?? physique, morale de sa vie priv??e et de son patrimoine.
</p>
<p>
Il a les pouvoirs suivants :
</p>
<p>
- Le pouvoir de direction. A cet effet, il peut d??cider de l???acc??s d???un'.$accord.' salari??'.$accord.' ?? un niveau sup??rieur, d??terminer les t??ches ?? accomplir et le rythme de travail.
</p>
<p>
- Le pouvoir disciplinaire. A ce titre, l???employeur peut sanctionner les fautes commises par l???employ??'.$accord.', ?? travers les sanctions telles: la mise ?? pied, l???amende, l???avertissement, la mutation et le licenciement.
</p>
<p>
- Le pouvoir de r??viser le contrat de travail, en raison des circonstances ??conomiques ou techniques.
</p>

<p>
<b>
ARTICLE 7 : DROITS ET AVANTAGES SOCIAUX</b>
</p>
<p>
'.$majdeterminant.' salari??'.$accord.' a droit ?? :  
</p>
    
<p>
   '. html_entity_decode(str_replace("-","<br/>",utf8_encode($avantage))).'
</p>
 


<p>
<b>ARTICLE 8 : CLAUSE DE NON CONCURRENCE</b>
</p>

<p>
Il est interdit au salari??'.$accord.' d???exercer, m??me en dehors de son temps de travail, toute activit?? ?? caract??re professionnelle, susceptible de concurrencer l???entreprise ou de nuire ?? la bonne ex??cution des services convenus.
</p>

<p>
<b>ARTICLE 9 : CLAUSE DE CONFIDENTIALITE</b>
</p>

<p>
'.$majdeterminant.' salari??'.$accord.' s???engage ?? observer la discr??tion la plus stricte sur les informations se rapportant aux activit??s de la soci??t?? auxquelles il aura acc??s ?? l???occasion et dans le cadre de sa fonction.
</p>
<p>
Notamment, '.$pronom.' ne devra pas divulguer ?? quiconque les m??thodes, recommandations, cr??ations, devis, ??tudes, projets, savoir-faire de l???entreprise r??sultant de travaux r??alis??s dans l???entreprise qui sont couverts par le secret professionnel le plus strict. '.$majpronom.' sera li??'.$accord.' par la m??me obligation vis-??-vis de tout renseignement ou document dont il aura pris connaissance chez les clients de la soci??t??.
</p>
<p>
Tous les documents, lettres, notes de service, instructions, m??thodes, organisation et/ou fonctionnement de l???entreprise dont '.$pronom.' pourra avoir connaissance dans l???exercice de sa fonction, seront confidentiels et resteront la propri??t?? exclusive de la Soci??t??.
</p>
<p>
'.$majdeterminant.' salari??'.$accord.' ne pourra, sans accord ??crit de l???employeur, publier aucune ??tude sous quelque forme que ce soit portant sur des travaux ou des informations couvertes par l???obligation de confidentialit??. Cette obligation de confidentialit?? se prolongera apr??s la cessation du contrat de travail, quelle qu???en soit la cause.
</p>

<p>
<b>
ARTICLE 10. FIN DU CONTRAT
</b>
</p>

<p>
Le pr??sent contrat prend fin dans les conditions ci-dessous :
</p>
<p>
Le contrat prend fin dans les conditions ci-apr??s :
</p>

<p>
 <span>&#10147;</span> Au terme de la p??riode contractuelle stipul??e ?? l???article 5 ci-dessus ; 
</p>

<p>
 <span>&#10147;</span> En cas de force majeure, l???accord commun des parties ou la faute lourde du salari??'.$accord.' ; 
</p>

<p>
 <span>&#10147;</span> Pendant la p??riode d???essai fix??e sans fraude ni abus, le contrat de travail peut ??tre rompu librement sans pr??avis et sans que l???une ou l???autre des parties puissent pr??tendre ?? indemnit??s. 
</p>

 

 <p>
<b>ARTICLE 11 : LOI APPLICABLE ??? LITIGES</b>
</p>

<p>
Le contrat est interpr??t?? et r??gi conform??ment ?? la l??gislation du travail en vigueur, notamment la loi n??2015-532 du 20 Juillet 2015 portant code du travail en C??te d???Ivoire, la convention collective interprofessionnelle du 19 Juillet 1977 ainsi que toutes autres lois sociales.
</p>

<p>
Tout diff??rend n?? de l???application de ce contrat doit ??tre r??solu selon la proc??dure pr??vue ?? cet effet par la l??gislation du travail.     
</p>


<p>
Fait ?? Abidjan le '.$date_signature.',   
</p>

<p>
En deux (2) exemplaires originaux.
</p>

<p>
    <table>
        <tr>
            <td> <b><u>L???EMPLOYE'.strtoupper($accord).'</b></u></td>
           <td></td>
           <td></td>
            <td> <b><u>L\'EMPLOYEUR</b></u> </td>
        </tr>
         <tr> 
            <td></td>
            <td></td>
              <td></td>
         </tr>
         <tr> 
            <td></td>
            <td></td>
              <td></td>
         </tr>
          <tr> 
            <td></td>
            <td></td>
              <td></td>
         </tr>
          <tr> 
            <td></td>
            <td></td>
              <td></td>
         </tr>
          <tr> 
            <td></td>
            <td></td>
              <td></td>
         </tr>
          <tr> 
            <td></td>
            <td></td>
              <td></td>
         </tr>

         <tr>
             <td>'.$nom.' '.$prenoms.' </td>
            <td></td>
            <td></td>
            <td> ELLEPO S??bastien </td>
          </tr>
    </table>
</p>
 

<!-- END CONTENT -->
'; 
$pdf->writeHTMLCell(0, 0, '', '',$html2, 0, 1, 0, true, '', true);

$pdf->Output('cdd_essai.pdf', 'I');

//============================================================+
// END OF FILE
//============================================================+


      


?>