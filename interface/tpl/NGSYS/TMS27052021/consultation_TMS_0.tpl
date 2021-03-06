<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consultation de timesheet</title>
	<link href="/{NOM_APPLICATION}/include/style_nouveau/style_accueil.css" rel="stylesheet">
    <link href="/{NOM_APPLICATION}/include/bootstrap-3.3.7/dist/css/bootstrap.min.css" rel="stylesheet">
	<link href='https://use.fontawesome.com/releases/v5.0.8/css/all.css' type='text/css' rel='STYLESHEET' />
	<script type='text/javascript' src='/{NOM_APPLICATION}/include/script/association.js'></script> 
	<script type='text/javascript' src='/{NOM_APPLICATION}/include/script/vocabulaire.js'></script>
	<script type='text/javascript' src='/{NOM_APPLICATION}/include/script/fermeture.js'></script>
	<script type='text/javascript' src='/{NOM_APPLICATION}/include/script/saisie.js'></script>
	<script type='text/javascript' src='/{NOM_APPLICATION}/include/script/calendrier.js'></script>
	<script type='text/javascript' src='/{NOM_APPLICATION}/include/script/attente_fichier.js'></script>
	<script type='text/javascript' src='/{NOM_APPLICATION}/include/script/recupcontrolsaisie.js'></script>
	<script type='text/javascript' src='/{NOM_APPLICATION}/include/script/navigation.js'></script>
	<script type='text/javascript' src='/{NOM_APPLICATION}/include/script/action_tableau.js'></script>
	<script type='text/javascript' src='/{NOM_APPLICATION}/include/script/ajax_search.js'></script>
	<script language='javascript' src='/{NOM_APPLICATION}/include/script/ajax_recup_listhier.js'></script>
	<script language='javascript' src='/{NOM_APPLICATION}/include/script/ajax_recup_arbo_dossier.js'></script>
	<script language='javascript' src='/{NOM_APPLICATION}/include/script/action_accueil.js'></script>
	
	<!--ABASS INCLUDE-->
		<link href="/{NOM_APPLICATION}/include/ressources/plugins/all/fonts/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
		<link href="/{NOM_APPLICATION}/include/ressources/plugins/all/css/local/template.css" rel="stylesheet" type="text/css" />
		<link href="/{NOM_APPLICATION}/include/ressources/plugins/all/css/local/bootstrap.css" rel="stylesheet" type="text/css" />
		<link type="text/css"  href="/{NOM_APPLICATION}/include/bootstrap-3.3.7/dist/css/bootstrap.css"></link>
		<script type="text/javascript"  src="/{NOM_APPLICATION}/include/bootstrap-3.3.7/dist/js/bootstrap.min.js"></script>
		<script type="text/javascript"  src="/{NOM_APPLICATION}/include/jQuery/jquery.min.js"></script>
	<!--ABASS INCLUDE-->
	
	<!-- <link href="/{NOM_APPLICATION}/include/ressources/plugins/all/css/local/template.css" rel="stylesheet" type="text/css" /> -->
	
	<!-- JQUERY UI -->
		<link href="../../../../include/libraries/jquery-ui/css/smoothness/jquery-ui-1.10.3.custom.css" rel="stylesheet" type="text/css" />
	<!-- END JQUERY UI -->
	
	<style>
		.col1_partie{
			width: 100%;
			font-family: 'Times New Roman';
			font-size: 15px;
			font-weight: lighter;
			background: #4a67b3;
			color: #fff; 
			padding: 5px; 
			border-top-right-radius: 6px;
			border-top-left-radius: 6px;
		}
		
		.col2_partie{
			width:100%;
			border: 1px solid #4a67b3; 
			margin: -1% 0%; 
			padding-left: 27px;
			padding-top: 5px;
		}
		
		.col_list_02{
			position: absolute;
			font-size: 11px;
			background-color: #4a67b3;
			color: #fff;
			font-weight: lighter; 
			cursor: pointer;
			z-index: 999;
		}
		
		.Affi_calendor{
			position: absolute;
			margin-top: 4%;
			margin-left: 33%;
			list-style: none;
			z-index: 1;
			opacity: 0;
			transform-origin: top left;
			transform: scale(0);
			transition: all 750ms;
		}
		.Affi_calendor.open{
			opacity: 1;
			transform: scale(1);
		}
		
		input.btn{
			width: 12%;
			border: 1px solid #4a67b3;
			text-align: center;
			background: transparent;
			color: #4a67b3;
		}
		
		.col3_partie{
			width:100%;
			border: 1px solid #4a67b3; 
			margin: 0%; 
			padding-left: 27px;
			padding-top: 5px;
		}
		
		.col_list{
			width: 50%;
			margin-top: -3%;
			margin-right: 5%;
			font-family: 'Times New Roman';
			font-size: 17px;
			background-color: transparent;
			font-weight: lighter; 
			float: right;
		}

		.button_plus{
			font-size: 11px;
			background-color: #4a67b3;
			color: #fff;
			font-weight: lighter; 
			cursor: pointer;
			margin-top: 3px;
		}
		
		.header-const{
			margin-bottom: 3%;
		}
		
	</style>
</head>
<body  class='tpl_consultation tpl_consultation_tms' onLoad='initTplConsultation();{GRISE_CHAMP};' onBeforeUnLoad="{CODE_ACTION_UNLOAD}" style="background-color: transparent;font-family: 'Times New Roman';">
  <!-- <form name='principal' ACTION='{URL_ATTENTE}' method='POST' onSubmit='return validerCreation();'> -->

	<form name='principal' ACTION='{URL_ATTENTE}' method='POST'>
		<input type='hidden' name='URL' value='{CODE_ACTION}'>
		<input type='hidden' name='POS_NUM_DOC' value='{POS_NUM_DOC}'>
		<input type='hidden' name='POS_TYPEDOC'  value='TMS'/>
		<input type='hidden' name='MODE' value='{MODE}'>
		<input type='hidden' name='NB_ONGLETS' value='4'>
		<!-- BEGIN BLOC_OLD_VALUE -->
		<input type='hidden' name='{NAME_OLD_RUB}' value="{VALUE_OLD_RUB}">
		<!-- END BLOC_OLD_VALUE -->
		
		<header class="header-const">
			<div id="actions-container" class="ui-widget-content titre-boutons" style="padding-left: 3%; text-align: center; background: transparent; border: none">
				 {ENTETE}
			</div>
			<div class="navbar navbar-default t3-mainnav marginBottom-0" role="navigation" style="margin-top: -1.7%">
				<div class="navbar-header">
					<button title="Clicquez ici pour voir les onglets" style="float:left;" type="button" class="btn navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse-5">
						<i class="fa fa-bars fa-lg"></i> 
					</button>
				</div>
				<div class="collapse navbar-collapse " id="navbar-collapse-3">
					<ul class="nav navbar-nav level0 nav-tabs">
						<li class="active b1" ><a role="button" class="btn btn-outline-primary" data-toggle="tab" href="#tabs-1" style="width: 100%;padding-top: -11px;">Demande</a></li>
						<li class="b2"><a role="button" class="btn-outline-primary" data-toggle="tab" href="#tabs-2" style="width: 100%;padding-top: -11px;">Traitement</a></li>
						<li class="b3"><a role="button" class="btn-outline-primary" data-toggle="tab" href="#tabs-3" style="width: 100%;padding-top: -11px;">Document</a></li>
						<li class="b4"><a role="button" class="btn-outline-primary" data-toggle="tab" href="#tabs-4" style="width: 100%;padding-top: -11px;">Historique</a></li>
					</ul>
				</div>
			</div>
		</header>

		<div class="tab-content" style="margin-top: 0px;">
		   <div class="tab-pane fade active in"  id="tabs-1" style="margin-top: 0;">
				<div class="  col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<!-- debut -->
						<nav class="container-fluid">
							<div class="text-center" style="font-weight: 1;color: #023b7c;font-size: 19px;margin-top: -1%">
								<div class="h4" style="text-transform: uppercase;">
									<span>TIMESHEET</span>
								</div>
								<div class="h6" style="text-transform: uppercase;">
									<span>SEMAINE: <span class="tacheweek"> 00</span>, 
									<span class="datecheck">Jeudi 26 Novembre 2020</span>
									<input class="form-control datechck" type="hidden"/>
								</div>
								<div class="contenu_calendor" style="margin-top: 1.5%;margin-left: -9%">
									<span class="col_list_02 btn">Changer la date</span>
								</div>
								<div class="Affi_calendor text-center"></div>
							</div>

							<div class="col-sm-12" style="margin-top: 3%;">
								<!--debut table  -->
								<table class="test" id="table_tache" style="width: 100%;text-align: center; margin-top: 2%;">
									 <thead>
										<tr>
											<td style="width: 20px;border:1px solid transparent;">
												<span style="width: 100%;"></span>
											</td>
											<td style="width: 150px;height: 7vh;border:none;background: #4a67b3;border-top-left-radius: 5px; border-bottom-left-radius: 5px;text-align: center;padding-top: 6px">
												<span style="width: 100%;font-size: 12px; color: #fff;font-weight: 1;padding: 5px">Activit&#233;s</span>
											</td>
											<td style="width: 300px;height: 7vh;border:none;background: #4a67b3;text-align: center;padding-top: 6px">
												<span style="width: 100%;font-size: 12px; color: #fff;font-weight: 1;padding: 5px">Taches</span>
											</td>
											<td style="width: 80px;height: 7vh;border:none;background: #4a67b3;text-align: center;padding-top: 6px">
												<span style="width: 100%;font-size: 12px; color: #fff;font-weight: 1;padding: 5px">Heure d&#233but</span>
											</td>
											<td style="width: 80px;height: 7vh;border:none;background: #4a67b3;text-align: center;padding-top: 6px">
												<span style="width: 100%;font-size: 12px; color: #fff;font-weight: 1;padding: 5px">Heure fin</span>
											</td>
											<td style="width: 80px;height: 7vh;border:none;background: #4a67b3;text-align: center;padding-top: 6px">
												<span style="width: 100%;font-size: 12px; color: #fff;font-weight: 1;padding: 5px">Dur&#233;e</span>
											</td>
											<td style="width: 80px;height: 7vh;border:none;background: #4a67b3;text-align: center;padding-top: 6px">
												<span style="width: 100%;font-size: 12px; color: #fff;font-weight: 1;padding: 5px">Taux en %</span>
											</td>
											<td style="width: 80px;height: 7vh;border:none;background: #4a67b3;border-top-right-radius: 5px; border-bottom-right-radius: 5px;text-align: center;padding-top: 6px">
												<span style="width: 105%;font-size: 12px; color: #fff;font-weight: 1;padding: 5px">R&#233;sultat</span>
											</td>
										</tr>
									 </thead>

									<tbody class="tableL">
										<tr>
										    <!--bouton plus-->
											<td style="width: 20px;border:none;">
												<!-- <span class="button_plus addRow" style="width: 100%;"><i class="fa fa-plus"></i></span> -->
											</td>
											 <!--fin bouton plus-->
											<td style="width: 150px;border:none;">
				 								  <textarea type="text" name="activite[]" style="width: 100%;resize: none" class="form-control activite" rows="1"></textarea>
											</td>
											<td style="width: 300px;border:none;">
												<textarea type="text" name="tache[]" style="width: 100%; resize: none" rows="1" class="form-control tache"></textarea>
											</td>
											<td style="width: 80px;border:none;">
												<input type="time" name="heurein[]" style="width: 100%;" class="form-control heurein">
											</td>
											<td style="width: 80px;border:none;">
												<input type="time"  name="heureout[]" style="width: 100%;" class="form-control heureout">
											</td>
											<td style="width: 80px;border:none;">
												<input type="text" name="duree[]" style="width: 100%;" class="form-control duree">
											</td>
											<td style="width: 80px;border:none;">
												<input type="number" style="width: 100%;" class="form-control resultat"  id="resultat">
											</td>
											<td style="width: 80px;border:none;">
												<input type="text" name="resultat[]" style="width: 100%;" class="form-control resultat"  id="resultat">
											</td>
										</tr>
									</tbody>
								</table>
							<!--fin table  -->

								<!--resultat apres retour des donn??es  -->
								<span class="res"></span>
								<div class="col-sm">
									<span class="button_plus addRow btn" style="float: right;font-size: 11px">Ajouter une ligne</i></span>
								</div>
								 
								<div class="form-group row" style="margin-top: 6%">
									<div class="col-sm-8">
										<label></label>
									</div>
									<div class="col-sm-2" style="font-size: 12px">
										<label>Dur&#233;e totale</label>
										<input class="form-control dureetotale"  name="POS_VAL_RUB_DJ1" value="{POS_VAL_RUB_DJ1}"  id="dureetotale" placeholder="Dur&#233;e totale">
									</div>
									<div class="col-sm-2" style="font-size: 12px">
										<label>Taux journalier (%)</label>
										<input class="form-control tauxjournaliere"  name="POS_VAL_RUB_TAC" value="{POS_VAL_RUB_TAC}" id="bio" placeholder="Taux journalier">
									</div>
								</div>
							</div>

						</nav>
					<!-- fin -->
				</div>
		   </div>
		   <!-- traitement -->
			<div class="tab-pane fade in "  id="tabs-2" style="margin-top:0.5%;">
			   tabs2
		   </div>
		   <!-- document -->
		   <div class="tab-pane fade in "  id="tabs-3" style="margin-top:0.5%;">
				<div class="row">
					<div class="col-sm-6" style="margin-bottom: 2%;">
						<div class="col1_partie text-center">
							<span class="title text-while;font-size: 12px">MES FICHES</span>
						</div>
						<div class="col2_partie text-center" style="padding-top: 5%. padding-bottom: 0;">
							<iframe  src="../consultation/afficher_fichier.php?POS_TYPEDOC=NOT&POS_NUM_DOC={POS_NUM_DOC}&MODE={MODE}&MODE_FICHIER={MODE_FICHIER}" 
							name='fichier' id='fichierid'  width='100%' height='100px' scrolling='auto' frameborder='0' style="background: transparent"></iframe>
						</div>
					</div>
					<div class="col-sm-12">
						<div class="col1_partie text-center">
							<span class="title text-while;font-size: 12px">VISUALISEUR</span>
						</div>
						<div class="col2_partie text-center" style="padding-top: 3%">
							<iframe id='frm_affiche_fichier' name='frm_affiche_fichier' src='../afficheur/afficher_menu_fichier.php?POS_NUM_DOC={POS_NUM_DOC}#view=FitH'  height='630px' width='99%' scrolling='auto' frameborder='0' style=""></iframe>
						</div>
					</div>
				</div>
		   </div>
		   <!-- historique -->
		   <div class="tab-pane fade in "  id="tabs-4" style="margin-top:0.5%;">
			   <nav class="container-fluid">
					<div class="row" style="margin-top: 1%">
								<!-- 12_ 1 infos -->
						<div class="col-sm-6 mt-5">
							<div class="col1_partie text-center">
								<span class="title text-while;font-size: 12px">HISTORIQUE</span>
							</div>
							<div class="col3_partie" style="padding: 5%;">
								<!-- N?? poseidon -->
								<div class="form-group row" style="margin: 0%">
									<label for="bio">N&#176; poseidon</label>
									<input type="text" placeholder="N&#176; poseidon" class="form-control" style="width: 100%">
								</div>
								<!-- Etat Fiche -->
								<div class="form-group" style="margin: 1%">
									<label for="bio">Etat Fiche</label>
									<input type="text" placeholder="N&#176; poseidon" class="form-control" style="width: 100%">
								</div>
								<!-- Historique -->
								<div class="form-group" style="margin: 1%">
									<label for="bio">Historique</label>
									<textarea  class="form-control" id="bio" rows="5" style="width: 100%;resize: none;"></textarea>
								</div>
							</div>
						</div>
								<!-- 12_ 2 infos -->
						<div class="col-sm-6 mt-5">
							<div class="col1_partie text-center">
								<span class="title text-while;font-size: 10px">AUTORISATION D'ACCES</span>
							</div>
							<div class="col3_partie" style="padding-top: 10%;">
								<!-- Consultation -->
								<div class="form-group">
								   <label for="bio">Consultation :</label>
								  <textarea  class="form-control" id="bio" rows="2" style="width: 90%;resize: none;margin-top: -1%"></textarea>
								</div>
								<!-- Modification -->
								<div class="form-group">
								   <label for="bio">Modification :</label>
									<textarea  class="form-control" id="bio" rows="2" style="width: 90%;resize: none;margin-top: -1%"></textarea>
								</div>
								<!-- Suppression -->
								<div class="form-group">
								   <label for="bio">Suppression :</label>
									<textarea  class="form-control" id="bio" rows="2" style="width: 90%;resize: none;margin-top: -1%"></textarea>
								</div>
							</div>
						</div>
					</div>
				</nav>
		   </div>
		</div>
	</form>
</body>

	<!-- jquery  -->
		<script language='javascript' src="../../../../include/jQuery/jquery.3.3.1.js" charset="utf-8"></script>
		<script language='javascript' src="../../../../include/bootstrap-3.3.7/dist/js/bootstrap.min.js"></script>
		<script src="http://code.jquery.com/jquery-latest.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.16.0/jquery.validate.min.js"></script>
		<script src="../dist/jquery-steps.js"></script>
		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<!-- endjquery  -->
	
	 <script>
		var prof_util = "{PROFIL_UTILISATEUR}";	 
		switch (prof_util) {
		 case "ADMIN" :
			   $('.rhdmdabs').show();
			   $('.mydmdabs').hide();
				
				break;
		 case "RH":
			   $('.rhdmdabs').show();
			   $('.mydmdabs').hide();
				
				break;
		default:
		 $('.mydmdabs').show();
		
	  }
	//affichage en fonction du MODE sur le Formulaire  
	if($('.get_mode').val()=='CONSULTATION'){
		$('.btn').hide();
	}
		 
  //fonctionnement du Bouton Annuler
	 function videchamp(){
	
	   var inputArray = document.querySelectorAll('input');
		inputArray.forEach(function (input){
			input.value = "";
		});
		var textAreaArray = document.querySelectorAll('textArea');
		textAreaArray.forEach(function (textArea){
			textArea.value = "";
		});
		 
		 return false;
	 }
	//Fin fonctionnement du Bouton Annuler
	
	//initialisation du calendrier datepicker
		$.datepicker.regional['fr'] = {
			closeText: 'Fermer',
			prevText: 'Pr??c??dent',
			nextText: 'Suivant',
			currentText: 'Aujourd\'hui',
			monthNames: ['Janvier', 'F&eacute;vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Ao&ucirc;t', 'Septembre', 'Octobre', 'Novembre', 'D&eacute;cembre'],
			monthNamesShort: ['Janv.', 'F??vr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Ao??t', 'Sept.', 'Oct.', 'Nov.', 'D??c.'],
			dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
			dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
			dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
			weekHeader: 'Sem.',
			dateFormat: 'yy-mm-dd'
	   };
		
		$.datepicker.setDefaults($.datepicker.regional['fr']);
		
	   const event = new Date();
	   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
 	   $('.datecheck').text(event.toLocaleDateString('fr-FR', options));
	   $('.tacheweek').text(getWeek(event.toLocaleDateString('fr-FR', options))); 
		
	   //fin initialisation du calendrier datepicker
		
		
		$(document).ready(function() {
			// Affi_calendor
			$('.contenu_calendor').on('click', function(){
				$('.toggle').toggleClass('open');
				$('.Affi_calendor').toggleClass('open');
				//$('.contenu_calendor').toggleClass('open');
			});
			// Ajoute de ligne a la table
			 $(".add").click(function() {
                var ligne = "<tr><td style='width: 20px;border:none;'><input name='select' type='checkbox' style='width: 80%;font-size: 12px;margin-left: -1%;'></td><td style='width: 150px;border:none;'><input type='text' style='width: 100%;' class='form-control'></td><td style='width: 300px;border:none;'><input type='text' style='width: 100%;' class='form-control'></td><td style='width: 80px;border:none;'><input type='time' style='width: 100%;' class='form-control'></td><td style='width: 80px;border:none;'><input type='time' style='width: 100%;' class='form-control'></td><td style='width: 80px;border:none;'><input type='text' style='width: 100%;' class='form-control'></td><td style='width: 80px;border:none;'><select id='selection' class='form-control' style='width: 100%;'><option value='0'>0</option><option value='1'>10</option><option value='2'>20</option><option value='3'>30</option><option value='4'>40</option><option value='5'>50</option><option value='7'>70</option><option value='8'>80</option><option value='9'>90</option><option value='10'>100</option></select></td><td style='width: 80px;border:none;'><input type='text' style='width: 105%;' class='form-control'></td></tr>";
                $("table.test").append(ligne);
            });
            $(".delete").click(function() {
                $("table.test").find('input[name="select"]').each(function() {
                    if ($(this).is(":checked")) {
                        $(this).parents("table.test tr").remove();
                    }
                });
            });
			
			///calcul date et semaine
			var userLang = navigator.language || navigator.userLanguage;
			var options = $.extend({
				   onSelect: function() {
					 var selected = $(this).val();
					 //debut traitement lecture date timesheet
					 datepickdeb = new Date(selected.slice(0, 10));
					 let dateLocale = datepickdeb.toLocaleString('fr-FR', {
					   weekday: 'long',
					   year: 'numeric',
					   month: 'long',
					   day: 'numeric',
					   hour: 'numeric',
					   minute: 'numeric',
					   second: 'numeric'
					 });
					 $('.datecheck').text(dateLocale.split(' ')[0] + ' ' + dateLocale.split(' ')[1] + ' ' + dateLocale.split(' ')[2] + ' ' + dateLocale.split(' ')[3]);
					 $('.tacheweek').text(getWeek(datepickdeb)); 
					 //fin traitement 
					},
			});
			$(".Affi_calendor").datepicker(options);
			
		});  
		
		function getWeek(date) {
		  if (!(date instanceof Date)) date = new Date();

			  // ISO week date weeks start on Monday, so correct the day number
			  var nDay = (date.getDay() + 6) % 7;
			  // ISO 8601 states that week 1 is the week with the first Thursday of that year
			  // Set the target date to the Thursday in the target week
			  date.setDate(date.getDate() - nDay + 3);
			  // Store the millisecond value of the target date
			  var n1stThursday = date.valueOf();
			  // Set the target to the first Thursday of the year
			  // First, set the target to January 1st
			  date.setMonth(0, 1);
			  // Not a Thursday? Correct the date to the next Thursday
			  if (date.getDay() !== 4) {
				date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7);
			  }
			  // The week number is the number of weeks between the first Thursday of the year
			  // and the Thursday in the target week (604800000 = 7 * 24 * 3600 * 1000)
			 return 1 + Math.ceil((n1stThursday - date) / 604800000);
		}
   
	</script>
	
</html>


