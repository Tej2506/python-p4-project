"""Initial migration

Revision ID: f38699ad7735
Revises: 
Create Date: 2024-10-12 14:46:36.960809

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f38699ad7735'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('cars',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('manufacturer', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('price', sa.String(), nullable=True),
    sa.Column('power', sa.String(), nullable=True),
    sa.Column('engine', sa.String(), nullable=True),
    sa.Column('torque', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('features',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('_password_hash', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('car_features',
    sa.Column('car_id', sa.Integer(), nullable=True),
    sa.Column('feature_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['car_id'], ['cars.id'], name=op.f('fk_car_features_car_id_cars')),
    sa.ForeignKeyConstraint(['feature_id'], ['features.id'], name=op.f('fk_car_features_feature_id_features'))
    )
    op.create_table('comparisons',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('car_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['car_id'], ['cars.id'], name=op.f('fk_comparisons_car_id_cars')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_comparisons_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('comparisons')
    op.drop_table('car_features')
    op.drop_table('users')
    op.drop_table('features')
    op.drop_table('cars')
    # ### end Alembic commands ###