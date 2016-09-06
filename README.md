Fix -L option that is failing since JRuby 9.1.2.0
Gem::StubSpecification is an internal API that seems chainging often. 
Gem::Specification.add_spec is deprecated also. Therefore, here makes 
-L <path> option alias of -I <path>/lib by assuming that *.gemspec file 
always has require_paths = ["lib"].
