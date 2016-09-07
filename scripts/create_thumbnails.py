#! /usr/bin/env python
from PIL import Image
import os.path
import os, sys


def create_thumbnail(input, force=False, size=256):
    basename = 'thumbnail.' + os.path.basename(input)
    path = os.path.dirname(os.path.abspath(input))
    dest_path = re.sub('\/hblasins\/', '/rfrigato/', path)
    output = os.path.join(dest_path, basename)
    if os.path.exists(output):
        if force:
            os.path.remove(output)
        else:
            return
    if not os.path.exists(dest_path):
        os.makedirs(dest_path)
    im = Image.open(input)
    im.thumbnail((size, size))
    im.save(output, 'JPEG')

def main(folder):
    for root, dirs, files in os.walk(folder):
        for f in files:
            if re.search('(\.jpg|\.jpeg)$', f, re.I):
                print os.path.join(root, f)
                create_thumbnail(os.path.join(root, f))

if __name__=='__main__':
    if len(sys.argv) != 2:
        print 'Usage: create_thumbnail <folder>'
    else:
        folder = sys.argv[1]
        if not os.path.exists(folder):
            print 'folder {} does not exist'.format(folder)
        else:
            main(folder)
