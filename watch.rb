watch( 'app/scripts/*' )  {|md| system("make js") }
watch( 'app/styles/*' )  {|md| system("make lessc") }
watch( 'app/views/*' )  {|md| system("make ejs") }