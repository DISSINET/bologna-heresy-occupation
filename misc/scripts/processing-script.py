#!/bin/python3
'''
process bologna input table
'''

import argparse
import os
import glob
import pandas as pd

parser = argparse.ArgumentParser(description='process bologna input table')
parser.add_argument('infile', type=os.path.abspath, help='Input CSV')
parser.add_argument('outfile', type=os.path.abspath, help='Output CSV')
args = parser.parse_args()

df = pd.read_csv(args.infile)
colnames = ['male', 'female', 'dep', 'non_dep', 'church', 'craft', 'diss', 'free', 'man', 'qual', 'merch', 'offi', 'serv', 'sp', 'undef_heresy', 'undef_occ' ]
del_cols = ['label', 'residence_label', 'data_timestamp']

# make deletions
for col in del_cols:
    del df[col]

# make additions
for col in colnames:
    df[col] = 0

# populate columns
df['ones'] = 1
df['male'] = df['ones'].where(df['sex']=='m', 0)
df['female'] = df['ones'].where(df['sex']=='f', 0)
df['dep'] = df['ones'].where(df['deponent']=='deponent', 0)
df['non_dep'] = df['ones'].where(df['deponent']=='non-deponent', 0)

df['church'] = df['ones'].where(df['occupation_type']=='churchperson', 0)
df['craft'] = df['ones'].where(df['occupation_type']=='craftsman', 0)
df['diss'] = df['ones'].where(df['occupation_type']=='dissident minister', 0)
df['free'] = df['ones'].where(df['occupation_type']=='free profession', 0)
df['man'] = df['ones'].where(df['occupation_type']=='manual worker', 0)
df['qual'] = df['ones'].where(df['occupation_type']=='manufacturer or qualified worker', 0)
df['merch'] = df['ones'].where(df['occupation_type']=='merchant', 0)
df['offi'] = df['ones'].where(df['occupation_type']=='official', 0)
df['serv'] = df['ones'].where(df['occupation_type']=='servant', 0)
df['sp'] = df['ones'].where(df['occupation_type']=='service provider', 0)
df['undef_heresy'] = df['ones'].where(pd.isnull(df['cathar_milieu']), 0)
df['undef_occ'] = df['ones'].where(pd.isnull(df['occupation_type']), 0)

del df['ones']
del df['occupation_type']
del df['sex']
del df['deponent']

df['residence_id'] = df['residence_id'].astype(str) +","
df['name'] = df['name'].astype(str) +","

# group by coords
grp_df = df.groupby(['residence_x_coordinates', 'residence_y_coordinates'], as_index=False).sum()

# save output 
# grp_df.to_csv( f"{args.outfile}", encoding='utf-8-sig')
grp_df.to_json( f"{args.outfile}", force_ascii=False, orient="records")
