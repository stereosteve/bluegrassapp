watch( 'app/*' )  {|md| system("make js") }
watch( 'less/*' )  {|md| system("make lessc") }
watch( 'views/*' )  {|md| system("make ejs") }
