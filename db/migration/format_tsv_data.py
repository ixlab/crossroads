import sys
import json
import re
import hashlib 

def assert_unique_hash(row_hash, hashes, hash_file):
	if row_hash in hashes: 
		return False
	else:
		hash_file.write(row_hash+'\n')
		hashes.add(row_hash)
		return True

def format_tsv_output(**data):
	'''
	Outputs to stdout (or piped to a file) in tsv format for columns... 
	['created_at', 'address', 'engineType', 'fuel', 'interior', 'name', 
	'smartPhoneRequired', 'vin', 'coordinates']
	'''
	template = '{created_at}\t{address}\t{engineType}\t{fuel}\t{interior}\t{name}\t{smartPhoneRequired}\t{vin}\tSRID=4326;POINT({lng} {lat})'
	try:
		print(template.format(lat=data['coordinates'][1], lng=data['coordinates'][0], **data))
	except KeyError:
		pass

if __name__ == '__main__':
	log_fname = sys.argv[1]
	hash_fname = sys.argv[2]

	with open(hash_fname, 'r') as hash_file:
		global hashes
		hashes = set(hash_file.read().split('\n') or [])

	parse_regex = re.compile(r'(?P<created_at>[0-9]{10})\t(?P<data>\{.+\})')

	with open(log_fname, 'r') as file, open(hash_fname, 'a+') as hash_file:
		for row in file:
			# Line must match the regex format 
			match = parse_regex.match(row)
			if not match:
				continue
			
			# Line must not be recorded in the set of already uploaded lines 
			row_hash = hashlib.md5(match.group('data').encode()).hexdigest()
			if not assert_unique_hash(row_hash, hashes, hash_file):
				continue

			# Line must be json formatted
			try:
				json_data = json.loads(match.group('data'))
			except:
				continue
			created_at = match.group('created_at')
			for vehicle in json_data.get('placemarks', []):
				format_tsv_output(created_at=created_at, **vehicle)
