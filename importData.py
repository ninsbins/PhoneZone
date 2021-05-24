#!/usr/bin/env python3

"""A simple python script template.
"""

import os
import sys
import argparse
import subprocess
import pymongo


def error_message():
    print("Usage: python3 importData.py <path> <database_name>")
    print("Example: python3 importData.py ~/Download/dataset_dev phonezonetester")
    print("Pre-requisites for this script:\n\
    (1) python3 installed on system\n\
    (2) mongo shell has been downloaded and setup\n\
    (3) userlisting.json and phonelisting.json exist in specified path\n\
    (4) pymongo has been installed\n")

# command line args
# 0: path to the folder containing userlisting.json and phonelisting.json
# 1: database name on cluster


def main(arguments):

    if(not len(arguments) == 2):
        print("Error: Please supply path to the dataset folder as command line argument 1 and the database name as command line argument 2. ")
        error_message()
        exit(-1)

    print(f"Supplied path: {arguments[0]}")

    folder_exists = os.path.isdir(arguments[0]+"/")
    if(not folder_exists):
        print("Error: Folder not found")
        exit(-1)
    path = arguments[0]

    # Check for required files.
    res = subprocess.check_output(
        [f"ls {path}"], shell=True, encoding="utf8")
    asStr = res.splitlines()
    if ("userlist_demo.json" and 'phonelisting_demo.json') not in asStr:
        print('Error: A file named userlist.json and phonelisting.json must be present in the specified directory')
        exit(-1)

    # execute mongo script for users
    print("Importing data...")
    db_name = arguments[1]
    subprocess.run(
        [f"mongoimport --uri mongodb+srv://matt:testadmin@phonezone.ixyyf.mongodb.net/{db_name} --collection users --type json --file {path}/userlist_demo.json --jsonArray"], shell=True)

    subprocess.run(
        [f"mongoimport --uri mongodb+srv://matt:testadmin@phonezone.ixyyf.mongodb.net/{db_name} --collection phones --type json --file {path}/phonelisting_demo.json --jsonArray"], shell=True)

    # Update the phones with proper images
    print("Connecting with PyMongo to update phone images...")
    connect_str = f"mongodb+srv://matt:testadmin@phonezone.ixyyf.mongodb.net/{db_name}?retryWrites=true&w=majority"
    client = pymongo.MongoClient(
        connect_str, tls=True, tlsAllowInvalidCertificates=True)

    db = client[f"{db_name}"]
    brands = ["Apple", "BlackBerry", "HTC", "Huawei",
              "LG", "Motorola", "Nokia", "Samsung", "Sony"]
    for b in brands:
        db["phones"].update_many(
            {"brand": b}, {"$set": {"image": f"{b}.jpeg"}}, upsert=True)

    print("Complete")


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
