<?php 

   include ('../../../../../../configuration_w/mabd.php');


   $num_poseidon= $_GET['num_poseidon'] ;



    //echo $usr_email.' '.$num_poseidon.' '.$reg_date;


   pg_query("ALTER TABLE public.pos_tab_index_mis DISABLE TRIGGER ALL ");

   pg_query(" DELETE FROM public.pos_tab_index_mis WHERE \"NUD\"='".$num_poseidon."' ");
   

?>