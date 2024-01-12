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
df['all'] = df['male'] + df['female']
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

df['undef_heresy'] = df['ones'].where(((df['cathar_milieu']==0) & (df['apostolic_milieu']==0) & (df['other_heterodoxy']==0)), 0)
df['undef_occ'] = df['ones'].where(pd.isnull(df['occupation_type']), 0)

# subsets
# male
df['m_church'] = df['ones'].where((df['occupation_type']=='churchperson') & (df['sex']=='m'), 0)
df['m_craft'] = df['ones'].where((df['occupation_type']=='craftsman') & (df['sex']=='m'), 0)
df['m_diss'] = df['ones'].where((df['occupation_type']=='dissident minister') & (df['sex']=='m'), 0)
df['m_free'] = df['ones'].where((df['occupation_type']=='free profession') & (df['sex']=='m'), 0)
df['m_man'] = df['ones'].where((df['occupation_type']=='manual worker') & (df['sex']=='m'), 0)
df['m_qual'] = df['ones'].where((df['occupation_type']=='manufacturer or qualified worker') & (df['sex']=='m'), 0)
df['m_merch'] = df['ones'].where((df['occupation_type']=='merchant') & (df['sex']=='m'), 0)
df['m_offi'] = df['ones'].where((df['occupation_type']=='official') & (df['sex']=='m'), 0)
df['m_serv'] = df['ones'].where((df['occupation_type']=='servant') & (df['sex']=='m'), 0)
df['m_sp'] = df['ones'].where((df['occupation_type']=='service provider') & (df['sex']=='m'), 0)

df['m_undef_heresy'] = df['ones'].where(((df['cathar_milieu']==0) & (df['apostolic_milieu']==0) & (df['other_heterodoxy']==0) & (df['sex']=='m')), 0)
df['m_undef_occ'] = df['ones'].where((pd.isnull(df['occupation_type'])) & (df['sex']=='m'), 0)

# female
df['f_church'] = df['ones'].where((df['occupation_type']=='churchperson') & (df['sex']=='f'), 0)
df['f_craft'] = df['ones'].where((df['occupation_type']=='craftsman') & (df['sex']=='f'), 0)
df['f_diss'] = df['ones'].where((df['occupation_type']=='dissident minister') & (df['sex']=='f'), 0)
df['f_free'] = df['ones'].where((df['occupation_type']=='free profession') & (df['sex']=='f'), 0)
df['f_man'] = df['ones'].where((df['occupation_type']=='manual worker') & (df['sex']=='f'), 0)
df['f_qual'] = df['ones'].where((df['occupation_type']=='manufacturer or qualified worker') & (df['sex']=='f'), 0)
df['f_merch'] = df['ones'].where((df['occupation_type']=='merchant') & (df['sex']=='f'), 0)
df['f_offi'] = df['ones'].where((df['occupation_type']=='official') & (df['sex']=='f'), 0)
df['f_serv'] = df['ones'].where((df['occupation_type']=='servant') & (df['sex']=='f'), 0)
df['f_sp'] = df['ones'].where((df['occupation_type']=='service provider') & (df['sex']=='f'), 0)

df['f_undef_heresy'] = df['ones'].where(((df['cathar_milieu']==0) & (df['apostolic_milieu']==0) & (df['other_heterodoxy']==0) & (df['sex']=='f')), 0)
df['m_undef_occ'] = df['ones'].where((pd.isnull(df['occupation_type'])) & (df['sex']=='f'), 0)

# deponent
df['d_church'] = df['ones'].where((df['occupation_type']=='churchperson') & (df['deponent']=='deponent'), 0)
df['d_craft'] = df['ones'].where((df['occupation_type']=='craftsman') & (df['deponent']=='deponent'), 0)
df['d_diss'] = df['ones'].where((df['occupation_type']=='dissident minister') & (df['deponent']=='deponent'), 0)
df['d_free'] = df['ones'].where((df['occupation_type']=='free profession') & (df['deponent']=='deponent'), 0)
df['d_man'] = df['ones'].where((df['occupation_type']=='manual worker') & (df['deponent']=='deponent'), 0)
df['d_qual'] = df['ones'].where((df['occupation_type']=='manufacturer or qualified worker') & (df['deponent']=='deponent'), 0)
df['d_merch'] = df['ones'].where((df['occupation_type']=='merchant') & (df['deponent']=='deponent'), 0)
df['d_offi'] = df['ones'].where((df['occupation_type']=='official') & (df['deponent']=='deponent'), 0)
df['d_serv'] = df['ones'].where((df['occupation_type']=='servant') & (df['deponent']=='deponent'), 0)
df['d_sp'] = df['ones'].where((df['occupation_type']=='service provider') & (df['deponent']=='deponent'), 0)

df['d_undef_heresy'] = df['ones'].where(((df['cathar_milieu']==0) & (df['apostolic_milieu']==0) & (df['other_heterodoxy']==0) & (df['deponent']=='deponent')), 0)
df['d_undef_occ'] = df['ones'].where(pd.isnull(df['occupation_type'])& (df['deponent']=='deponent'), 0)

# nondeponent
df['n_church'] = df['ones'].where((df['occupation_type']=='churchperson') & (df['deponent']=='non-deponent') , 0)
df['n_craft'] = df['ones'].where((df['occupation_type']=='craftsman') & (df['deponent']=='non-deponent'), 0)
df['n_diss'] = df['ones'].where((df['occupation_type']=='dissident minister') & (df['deponent']=='non-deponent'), 0)
df['n_free'] = df['ones'].where((df['occupation_type']=='free profession') & (df['deponent']=='non-deponent'), 0)
df['n_man'] = df['ones'].where((df['occupation_type']=='manual worker') & (df['deponent']=='non-deponent'), 0)
df['n_qual'] = df['ones'].where((df['occupation_type']=='manufacturer or qualified worker') & (df['deponent']=='non-deponent'), 0)
df['n_merch'] = df['ones'].where((df['occupation_type']=='merchant') & (df['deponent']=='non-deponent'), 0)
df['n_offi'] = df['ones'].where((df['occupation_type']=='official') & (df['deponent']=='non-deponent'), 0)
df['n_serv'] = df['ones'].where((df['occupation_type']=='servant') & (df['deponent']=='non-deponent'), 0)
df['n_sp'] = df['ones'].where((df['occupation_type']=='service provider') & (df['deponent']=='non-deponent'), 0)

df['n_undef_heresy'] = df['ones'].where(((df['cathar_milieu']==0) & (df['apostolic_milieu']==0) & (df['other_heterodoxy']==0) & (df['deponent']=='non-deponent')), 0)
df['n_undef_occ'] = df['ones'].where(pd.isnull(df['occupation_type']) & (df['deponent']=='non-deponent'), 0)

del df['ones']
del df['occupation_type']
del df['sex']
del df['deponent']

df['residence_id'] = df['residence_id'].astype(str) +","
df['name'] = df['name'].astype(str) +","


# group by coords
grp_df = df.groupby(['residence_x_coordinates', 'residence_y_coordinates'], as_index=False).sum()

# sort desc
grp_df.sort_values(by=['all'], inplace=True, ascending=False)
del grp_df['all']

# split by location


# save output 
# grp_df.to_csv( f"{args.outfile}", encoding='utf-8-sig')
grp_df.to_json( f"{args.outfile}", force_ascii=False, orient="records")
