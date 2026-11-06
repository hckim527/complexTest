<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:template match="/">
<xsl:apply-templates/>
</xsl:template>
<xsl:template match="*">
<xsl:element name="{name()}">
<xsl:if test="string-length(@id) > 0">
<xsl:attribute name="id"><xsl:value-of select="current()/@id"/></xsl:attribute>
</xsl:if>
<xsl:value-of select="current()/@value"/>
<xsl:apply-templates select="*"/>
</xsl:element>
</xsl:template>
</xsl:stylesheet>