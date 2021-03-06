<?php
  
// Send Headers
header('Content-type: application/pdf');
header('Content-Disposition: attachment; filename="myPDF.pdf');

// Send Headers: Prevent Caching of File
header('Cache-Control: private');
header('Pragma: private');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

    session_start();    
 
    include ('../../../../../configuration_w/mabd.php');
    require('../../../../../configuration_w/PDF/fpdf.php');
   //  require('../../../../../configuration_w/cellfit/cellfit.php');

     $numposeidon= $_GET['numposeidon'] ;

class PDF extends FPDF
{

   //FIT
   //Cell with horizontal scaling if text is too wide
	 
   //end FIT CELL

   // HTML PARSER
      protected $B = 0;
      protected $I = 0;
      protected $U = 0;
      protected $HREF = '';

         function WriteHTML($html)
         {
         $html = str_replace("\n",' ',$html);
         $a = preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
         foreach($a as $i=>$e)
         {
            if($i%2==0)
            {
               // Text
               if($this->HREF)
                  $this->PutLink($this->HREF,$e);
               else
                  $this->Write(5,$e);
            }
            else
            {
               // Tag
               if($e[0]=='/')
                  $this->CloseTag(strtoupper(substr($e,1)));
               else
               {
                  // Extract attributes
                  $a2 = explode(' ',$e);
                  $tag = strtoupper(array_shift($a2));
                  $attr = array();
                  foreach($a2 as $v)
                  {
                     if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                        $attr[strtoupper($a3[1])] = $a3[2];
                  }
                  $this->OpenTag($tag,$attr);
               }
            }
         }
      }
      function WriteHtmlCell($cellWidth, $html){
         $rm = $this->rMargin;
         $lm = $this->lMargin;
         $this->SetRightMargin($this->w - $this->GetX() - $cellWidth);

         $this->SetLeftMargin($this->GetX());

         $this->WriteHtml($html);
         $this->SetRightMargin($rm);
         $this->SetLeftMargin($lm);
      }

      function OpenTag($tag, $attr)
      {
         // Opening tag
         if($tag=='B' || $tag=='I' || $tag=='U')
            $this->SetStyle($tag,true);
         if($tag=='A')
            $this->HREF = $attr['HREF'];
         if($tag=='BR')
            $this->Ln(5);
      }

      function CloseTag($tag)
      {
         // Closing tag
         if($tag=='B' || $tag=='I' || $tag=='U')
            $this->SetStyle($tag,false);
         if($tag=='A')
            $this->HREF = '';
      }

      function SetStyle($tag, $enable)
      {
         // Modify style and select corresponding font
         $this->$tag += ($enable ? 1 : -1);
         $style = '';
         foreach(array('B', 'I', 'U') as $s)
         {
            if($this->$s>0)
               $style .= $s;
         }
         $this->SetFont('',$style);
      }

         function PutLink($URL, $txt)
         {
            // Put a hyperlink
            $this->SetTextColor(0,0,255);
            $this->SetStyle('U',true);
            $this->Write(5,$txt,$URL);
            $this->SetStyle('U',false);
            $this->SetTextColor(0);
         }

      //END  HTML PARSER
 
         //PIED DE PAGE
         function Footer()
         {
         //Police Arial italique 8
         $this->SetFont('Arial','I',8);
         //Positionnement ?? 1,5 cm du bas
         $this->SetY(-15);
         //D??calage
         $this->Cell(80);
         //Num??ro de page
         $this->Cell(30,10,'Page '.$this->PageNo().'/{nb}');
         
         } 

          //END PIED DE PAGE

}

      

        $pdf = new PDF();
        $pdf->AliasNbPages();
        $pdf->AddPage(); //page 1
        $pdf->SetFont('Times','',12);
        $pdf->Image('../../../../../images/logo/ngser.png',10,6,50,15);
         $pdf->Ln(15);
        $pdf->Cell(55);
         // Titre html_entity_decode
      $pdf->SetDrawColor(28 , 28, 28);
      $pdf->SetFillColor(221 , 222, 226);
      $pdf->SetTextColor(0 , 0, 0); 
      $pdf->SetLineWidth(0.5);
      $pdf->Rect(25 , 25, 160,10,'DF');
      $pdf->Cell(80,10,strtoupper( utf8_decode("CONTRAT STAGE DE QUALIFICATION ")),0,1,'C',0 );
       
      $pdf->SetXY(12,40);
      $pdf->SetFont('','B',12);
      $pdf->Cell(5,10,( utf8_decode("Entre :  ")),0,1,'C',0 );
      $pdf->SetFont('','BU',12);
      $pdf->SetXY(45,50);
      $pdf->Cell(20,5,( utf8_decode("Nouvelle G??n??ration  de Services en abr??g?? NGSER, ")),0,1,'C',0 );
      $pdf->SetFont('');
      $pdf->SetXY(42,60);
      $pdf->Cell(110,5,( utf8_decode("Soci??t?? ?? Responsabilit?? Limit??e, sise ?? Abidjan-plateau, Avenue Lambin, Immeuble MATCA, 4e Etage,  ")),0,1,'C',0 );
      $pdf->Cell(150,6,( utf8_decode("Appartement 65, immatricul??e au registre du commerce et du cr??dit mobilier sous le num??ro ")),0,1,'C',0 );
      $pdf->Cell(175,5,( utf8_decode("CI- ABJ-03-2020-M-11141 , 28 BP 722 Abidjan 28,t??l??phone (225) 20 22 12 53, repr??sent??e par le g??rant,  ")),0,1,'C',0 );
      $pdf->SetFont('','B',12);
      $pdf->Cell(48,5,( utf8_decode("Monsieur ELLEPO S??bastien, ")),0,0,'C',0 );   
      $pdf->SetFont('');
      $pdf->Cell(105,5,( utf8_decode("d??ment habilit?? aux fins des pr??sentes et de leurs suites,")),0,1,'C',0 );
       $pdf->SetFont('','B',12);
       $pdf->Ln(3);
       $pdf->SetX(46);
       $pdf->Cell(50,6,( utf8_decode("Ci-apr??s indiff??remment d??sign??e ??  NGSER ou l'entreprise d'accueil ?? ")),0,1,'C',0 );
       $pdf->Ln(3);
       $pdf->Cell(15,6,( html_entity_decode("D' une part ")),0,1,'C',0 );
       $pdf->Ln(3);
       $pdf->Cell(1,6,( html_entity_decode("ET ")),0,1,'C',0 );
      $pdf->SetFont('','B',12);
      $pdf->Cell(48,5,( utf8_decode("Mademoiselle xxxxxxxxxx, ")),0,1,'C',0 );   
      $pdf->SetFont('');
     $pdf->SetX(4.5);
      $pdf->WriteHtmlCell(195,utf8_decode("n?? le xxxxxx ?? xxxxxxxxxx, titulaire de la carte nationale d'identit?? immatricul??e xxxxxxxx, domicili?? ?? Abidjan-commune de xxxxxxxxxxxxx, ayant tous pouvoirs ?? l'effet des pr??sentes,"));
       
      $pdf->Ln(6);
       $pdf->SetFont('','B',12);
      
      $pdf->Cell(50,5,( utf8_decode("Ci-apr??s d??sign?? ?? la stagiaire ??")),0,1,'C',0 );   
      $pdf->Ln(3);
       $pdf->Cell(15,6,( html_entity_decode("D'autre part ")),0,1,'C',0 );
       $pdf->Ln(3);
       $pdf->SetFont('');
      $pdf->Cell(87,5,( utf8_decode("NGSER et la stagiaire ??tant individuellement d??sign??s ")),0,0,'C',0 );
      $pdf->SetFont('','B',12);
      $pdf->Cell(26,5,( utf8_decode(" ?? la partie ?? ")),0,0,'C',0 );   
      $pdf->SetFont('');
      $pdf->Cell(20,5,( utf8_decode("et ensemble")),0,0,'C',0 ); 
      $pdf->SetFont('','B',12);
      $pdf->Cell(28,5,( utf8_decode("?? les parties ??,")),0,1,'C',0 );  
      $pdf->Ln(5);
      $pdf->SetFont('','BU',12);
      $pdf->Cell(60,5,( utf8_decode("IL A ETE CONVENU CE QUI SUIT :")),0,1,'C',0 );
       
      $pdf->Ln(5);
      $pdf->SetFont('','B',12);
      $pdf->Cell(30,5,( utf8_decode(html_entity_decode("ARTICLE 1 : OBJET"))),0,1,'C',0 );

      $pdf->Ln(2);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->MultiCell(185,5, utf8_decode( html_entity_decode("Le pr??sent contrat a pour objet de donner au stagiaire une formation pratique lui permettant de se perfectionner en vue d'acqu??rir une exp??rience professionnelle dans le domaine de xxxxxxxxxxxxxxxx .") ) );

      $pdf->SetFont('','B',12);
      $pdf->Ln(3);
      $pdf->Cell(70,5,( utf8_decode(html_entity_decode("ARTICLE 2 : OBLIGATIONS DE NGSER "))),0,1,'C',0 );
      $pdf->SetFont('','B',12);

      $pdf->Ln(2);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->MultiCell(100,5, utf8_decode( html_entity_decode("NGSER s'engage ?? :") ) );


      $pdf->Ln(2);
      $pdf->SetFont('Zapfdingbats','',12);  
      $pdf->Cell(5,5,chr(2799),0,0,'C',0 );
      $pdf->SetFont('Times','',12);
 
      $pdf->SetX(15);
      $pdf->MultiCell(180,5, utf8_decode( html_entity_decode("Mettre ?? la disposition de la stagiaire un ma??tre de stage charg?? d'assurer le suivi et d'optimiser les conditions de r??alisation du stage ;") ) );

      
      $pdf->Ln(2);
      $pdf->SetFont('Zapfdingbats','',12);  
      $pdf->Cell(5,5,chr(2799),0,0,'C',0 );
      $pdf->SetFont('Times','',12);
 
      $pdf->SetX(15);
      $pdf->MultiCell(180,5, utf8_decode( html_entity_decode("Fournir ?? la stagiaire toutes informations n??cessaires ?? sa formation.") ) );


      $pdf->SetFont('','B',12);
      $pdf->Ln(3);
      $pdf->Cell(85,5,( utf8_decode(html_entity_decode("ARTICLE 3 : OBLIGATIONS DE LA STAGIAIRE"))),0,1,'C',0 );
      $pdf->SetFont('','B',12);

      $pdf->Ln(2);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->MultiCell(100,5, utf8_decode( html_entity_decode("La stagiaire est tenue de :") ) );

      $pdf->Ln(2);
      $pdf->SetFont('Zapfdingbats','',12);  
      $pdf->Cell(5,5,chr(2799),0,0,'C',0 );
      $pdf->SetFont('Times','',12);
 
      $pdf->SetX(15);
      $pdf->MultiCell(180,5, utf8_decode( html_entity_decode("Suivre les instructions fournies par son ma??tre de stage ;") ) );

      $pdf->Ln(2);
      $pdf->SetFont('Zapfdingbats','',12);  
      $pdf->Cell(5,5,chr(2799),0,0,'C',0 );
      $pdf->SetFont('Times','',12);
 
      $pdf->SetX(15);
      $pdf->MultiCell(180,5, utf8_decode( html_entity_decode("Respecter le r??glement int??rieur de l'entreprise d'accueil.") ) );

      $pdf->SetFont('','B',12);
      $pdf->Ln(5);
      $pdf->Cell(55,5,( utf8_decode(html_entity_decode("ARTICLE 4 : DUREE DU STAGE"))),0,1,'C',0 );
      $pdf->SetFont('','B',12);

      $pdf->Ln(2);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->MultiCell(185,5, utf8_decode( html_entity_decode("Le contrat a une dur??e de xxxxx (xxx) mois, ?? compter du xxx au xxxx.") ) );

      $pdf->AddPage(); //page 2

     
      $pdf->Ln(5);
      $pdf->SetFont('','B',12);
      $pdf->Cell(65,5,( utf8_decode(html_entity_decode("ARTICLE 5 : MODALITE DU STAGE"))),0,1,'C',0 );
 
      $pdf->Ln(2);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->MultiCell(185,5, utf8_decode( html_entity_decode("Le stage se d??roule au sein de l'entreprise d'accueil.") ) );

      $pdf->Ln(2);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->MultiCell(185,5, utf8_decode( html_entity_decode("La dur??e journali??re maximale de pr??sence de la stagiaire dans l'entreprise d'accueil est de huit (8) heures par jour ouvr??.") ) );

       $pdf->Ln(2);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->MultiCell(185,5, utf8_decode( html_entity_decode("Durant son stage, la stagiaire est soumise au r??glement int??rieur de l'entreprise d'accueil.  ") ) );


      $pdf->Ln(5);
      $pdf->SetFont('','B',12);
      $pdf->Cell(100,5,( utf8_decode(html_entity_decode("ARTICLE 6 : ABSENCE ET INTERRUPTION DU STAGE"))),0,1,'C',0 );

      $pdf->Ln(2);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->MultiCell(185,5, utf8_decode( html_entity_decode("Toute difficult?? survenue au cours du d??roulement du stage devra ??tre port??e ?? la connaissance de l'une des parties ?? l'autre afin d'??tre r??solue au plus vite.") ) );

      $pdf->Ln(2);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->MultiCell(185,5, utf8_decode( html_entity_decode("La stagiaire ne pourra s'absenter qu'apr??s avoir obtenu l'autorisation pr??alable de NGSER. ") ) );

      $pdf->Ln(5);
      $pdf->SetFont('','B',12);
      $pdf->Cell(52,5,( utf8_decode(html_entity_decode("ARTICLE 7 : REMUNERATION"))),0,1,'C',0 );

      $pdf->Ln(2);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->WriteHtmlCell(185,utf8_decode( html_entity_decode("NGSER s'engage ?? allouer ?? la stagiaire une indemnit?? forfaitaire mensuelle de <b>xxxx (xxxx) FCFA</b> .  ") ) );


      $pdf->Ln(7);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->WriteHtmlCell(185,utf8_decode( html_entity_decode("L'indemnit?? forfaitaire lui sera r??guli??rement vers??e dans un d??lai de huit (8) jours au plus tard, apr??s la fin du mois ouvrant droit au salaire par :") ) );

      $pdf->Ln(6);
      $pdf->SetFont('');
      $pdf->SetX(15);
      $pdf->WriteHtmlCell(200,utf8_decode("-	Virement bancaire ; "));

      $pdf->Ln(6);
      $pdf->SetFont('');
      $pdf->SetX(15);
      $pdf->WriteHtmlCell(200,utf8_decode("-	Ch??que ; ou "));

       $pdf->Ln(6);
      $pdf->SetFont('');
      $pdf->SetX(15);
      $pdf->WriteHtmlCell(200,utf8_decode("-	en esp??ces. "));


      $pdf->Ln(8);
      $pdf->SetFont('','B',12);
      $pdf->Cell(117,5,( utf8_decode(html_entity_decode("ARTICLE 8 : DEVOIR DE RESERVE ET DE CONFIDENTIALITE "))),0,1,'C',0 );

      $pdf->Ln(7);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->WriteHtmlCell(185,utf8_decode( html_entity_decode("Le devoir de r??serve et de confidentialit?? est de rigueur absolue. Le stagiaire prend donc l'engagement de n'utiliser en aucun cas les informations recueillies ou obtenues par lui pour en faire l'objet de publication, communication ?? des tiers sans accord pr??alable de l'entreprise d'accueil, y compris le rapport de stage. Cet engagement vaudra non seulement pour la dur??e du stage mais ??galement apr??s son expiration. Le stagiaire s'engage ?? ne conserver, emporter, ou prendre copie d'aucun document ou logiciel, de quelque nature que ce soit, appartenant ?? l'entreprise d'accueil, sauf accord de cette derni??re.") ) );


      $pdf->Ln(7);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->WriteHtmlCell(185,utf8_decode( html_entity_decode( "Dans le cadre de la confidentialit?? des informations contenues dans le rapport, l'entreprise d'accueil peut demander une restriction de la diffusion du rapport, voire le retrait de certains ??l??ments tr??s confidentiels.") ) );


      $pdf->Ln(7);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->WriteHtmlCell(185,utf8_decode( html_entity_decode( "Les personnes amen??es ?? en conna??tre sont contraintes par le secret professionnel ?? n'utiliser ni ne divulguer les informations du rapport. ") ) );


      $pdf->Ln(8);
      $pdf->SetFont('','B',12);
      $pdf->Cell(65,5,( utf8_decode(html_entity_decode("Article 9 : RESULTATS DES PROJETS "))),0,1,'C',0 );

      $pdf->Ln(5);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->WriteHtmlCell(185,utf8_decode( html_entity_decode("La propri??t?? des oeuvres r??alis??es, notamment les r??sultats des ??tudes, les sch??mas techniques, les produits informatiques, les documents ??labor??s etc., en application du pr??sent contrat, est attribu??e au client. A cette fin, le Consultant transf??re au client tous les droits sur les ??uvres pr??cit??es: droit de reproduction, droit de repr??sentation, droit de commercialisation, droit d'usage, de d??tention, d'adaptation, de traduction, et plus g??n??ralement, tous droits d'exploitation.") ) );


      $pdf->Ln(8);
      $pdf->SetFont('','B',12);
      $pdf->Cell(60,5,( utf8_decode(html_entity_decode("ARTICLE 10 : FIN DU CONTRAT "))),0,1,'C',0 );

      $pdf->Ln(5);
      $pdf->SetFont('');
      $pdf->SetX(5);
      $pdf->WriteHtmlCell(185,utf8_decode( html_entity_decode(" Le pr??sent contrat stage de qualification prend fin dans les conditions suivantes :") ) );

       $pdf->Ln(6);
      $pdf->SetFont('Zapfdingbats','',12);  
      $pdf->Cell(5,5,chr(2799),0,0,'C',0 );
      $pdf->SetFont('Times','',12);
      $pdf->Cell(133,5,( utf8_decode(html_entity_decode("Au terme de la p??riode stipul??e ?? l'article 4 susvis??, sans indemnit?? ni pr??avis."))),0,0,'C',0 );

       $pdf->Ln(6);
      $pdf->SetFont('Zapfdingbats','',12);  
      $pdf->Cell(5,5,chr(2799),0,0,'C',0 );
      $pdf->SetFont('Times','',12);
      $pdf->Cell(163,5,( utf8_decode(html_entity_decode("A l'initiative de l'entreprise d'accueil ou de la stagiaire lorsqu'ils disposent d'un motif l??gitime ;"))),0,0,'C',0 );

      $pdf->Ln(6);
      $pdf->SetFont('Zapfdingbats','',12);  
      $pdf->Cell(5,5,chr(2799),0,0,'C',0 );
      $pdf->SetFont('Times','',12);
      $pdf->Cell(45,5,( utf8_decode(html_entity_decode("En cas de force majeure ;"))),0,0,'C',0 );

      $pdf->Ln(6);
      $pdf->SetFont('Zapfdingbats','',12);  
      $pdf->Cell(5,5,chr(2799),0,0,'C',0 );
      $pdf->SetFont('Times','',12);
      $pdf->Cell(30,5,( utf8_decode(html_entity_decode("D'accord parties."))),0,0,'C',0 );

       




       $pdf->AddPage(); //page 3
       /////////////////////////////////////////////////////

 
    
      $pdf->Ln(8);
      $pdf->SetFont('','B',12);
      $pdf->Cell(60,5,( utf8_decode(html_entity_decode("ARTICLE 11 : LOI APPLICABLE "))),0,1,'C',0 );

      $pdf->Ln(4);
      $pdf->SetFont('');
      $pdf->SetX(4);
      $pdf->WriteHtmlCell(200,utf8_decode("Le contrat est interpr??t?? et r??gi conform??ment ?? la l??gislation du travail en vigueur, notamment la loi n??2015-532 du 20 Juillet 2015 portant code du travail en C??te d'Ivoire, la convention collective interprofessionnelle du 19 Juillet 1977 ainsi que toutes autres lois sociales."));


      $pdf->Ln(7);
      $pdf->SetFont('');
      $pdf->SetX(4);
      $pdf->WriteHtmlCell(200,utf8_decode("Tout diff??rend n?? de l'application de ce contrat doit ??tre r??solu selon la proc??dure pr??vue ?? cet effet par la l??gislation du travail. "));

      
      $pdf->Ln(7);
      $pdf->SetFont('');
      $pdf->SetX(4);
      $pdf->WriteHtmlCell(200,utf8_decode("Fait ?? Abidjan le xxxxxxxxxxxxxxxxx,"));

      $pdf->Ln(7);
      $pdf->SetFont('');
      $pdf->SetX(4);
      $pdf->WriteHtmlCell(200,utf8_decode("En deux (2) exemplaires originaux."));


     

      $pdf->Ln(10);
      $pdf->SetFont('','BU',12);
      $pdf->Cell(60,5,( utf8_decode(html_entity_decode("La stagiaire"))),0,0,'C',0 );
      $pdf->Cell(150,5,( utf8_decode(html_entity_decode("NGSER"))),0,1,'C',0 );


       $pdf->Ln(20);
      $pdf->SetFont('');
      $pdf->Cell(60,5,( utf8_decode(html_entity_decode("xxxxxxxxxxxxxxx"))),0,0,'C',0 );
      $pdf->Cell(150,5,( utf8_decode(html_entity_decode("ELLEPO S??bastien "))),0,1,'C',0 );









       $pdf->Output();

      


?>