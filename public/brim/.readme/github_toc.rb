#!/usr/bin/env ruby
# encoding: utf-8

=begin
github_toc v0.1.0
Brett Terpstra 2014

Creates a linked table of contents from headers in a GitHub readme
Place a [toc] marker in the file to have it automatically replaced with the TOC
If there's no marker, it dumps just the TOC to STDOUT

- You can use [toc 2] to limit the depth of the TOC from 1-4 levels
- You can also specify 1-4 after the command on the command line (`cat README.md|github_toc 3`)

Input:
- Specify a filename in the arguments to read from file on disk
- You can specify an output filename after the input file, otherwise output is to STDOUT
- Specifying the same file for input and output will modify in place

Usage:
  Piped text - `cat filename.md | github_toc` => returns only TOC
  Read a file, output to STDOUT - `github_toc filename.md` => returns full text of file with TOC
  Modify a file in place, with a depth limit - `github_toc 2 filename.md filename.md`

Notes:
- Header 1s (# Header) are ignored, only 2-6 are collected
- If a file already has a TOC generated by this script, running it again will replace it.
- Headers above the position of a [toc] tag or existing TOC in the document are ignored
=end

depth = false
infile = false
outfile = false

# Parse any arguments for a depth, input, and output file
ARGV.each do |arg|
  if arg =~ /^\d+$/
    depth = arg.to_i
  elsif File.exists?(File.expand_path(arg)) && !infile
    infile = File.expand_path(arg)
  elsif File.exists?(File.expand_path(arg))
    outfile = File.expand_path(arg)
  end
end

# If we found an infile, read it
if infile
  input = IO.read(infile)
# if not, hope for piped input on STDIN
else
  input = STDIN.read
end

# Error if we don't have any input
unless input && input.length > 0
  puts "You must pipe text to STDIN or specify filename"
  puts "#{File.basename(__FILE__)} [1-4] [input_file [output_file]]"
end

# Split the content at any included toc tag or block
# so that we can only analyze headers after that point
content = input.dup
if input =~ /^\[\s*toc\s*(\d+)\s*\]\s*$/i
  depth = $1.to_i
  content = content.split(/^\[toc\s*(\d+)\s*\]\s*$/i)[1..-1].join()
elsif input =~ /^\[\s*toc\s*\]\s*$/i
  content = content.split(/^\[\s*toc\s*\]\s*$/i)[1..-1].join()
elsif input =~ /^## Contents.*?<!-- end toc -->/m
  content = content.split(/^## Contents.*?<!-- end toc -->/m)[1..-1].join()
end

# Make sure depth is set and is between 1 and 4
depth = 1 unless depth
depth = 1 if depth < 1
depth = 4 if depth > 4

# Start the TOC block
toc = "## Contents\n\n"

# Find all the headers (2-6)
headers = content.scan(/^(\#{2,6})[^#](.*)$/)

# Narrow down the highest level header (lowest number)
top_level = 6
headers.each do |m|
  top_level = m[0].length if m[0].length < top_level
end

# Set the max level as a function of the highest available header
# and the max depth preference
max_level = top_level + (depth - 1)
headers.delete_if {|h| h[0].length > max_level}

# Build the TOC from the headers array
headers.each do |m|
  indent = "    " * (m[0].length - top_level)
  title = m[1]
  # Generate the GitHub style ID references
  link = title.gsub(/[^ a-z\-0-9]/i,'').gsub(/ +/,"-").downcase
  toc += "#{indent}- [#{title}](##{link})\n"
end

# Close the TOC block
toc += "\n"

# If the original content had the [toc] tag, replace that
if input =~ /^\[toc\s*(\d+)?\s*\]\s*$/mi
  output = input.sub(/^\[toc\s*(\d+)?\s*\]\s*$/mi, toc + "\n")
# If the original content had an existing TOC, replace that
elsif input =~ /^## Contents.*?<!-- end toc -->/m
  output = input.sub(/^## Contents.*?<!-- end toc -->/m, toc)
# Otherwise, just output the TOC block
else
  output = toc
end

# If we were given an output file, write to it
if outfile
  File.open(outfile,'w') do |f|
    f.puts output
  end
# Otherwise, output to STDOUT
else
  $stdout.puts output
end
