from setuptools import setup
import setuptools_black

setup(
    name="Todo List",
    version="1.0",
    long_description=__doc__,
    packages=["app"],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        "flask",
        "sqlalchemy",
        "flask-sqlalchemy",
        "flask-migrate",
        "flask-login",
        "marshmallow",
    ],
    setup_requires=["pytest-runner"],
    tests_require=["pytest", "pytest-flask"],
    cmdclass={"build": setuptools_black.BuildCommand},
)
