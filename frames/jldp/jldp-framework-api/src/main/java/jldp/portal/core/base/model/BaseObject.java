package jldp.portal.core.base.model;

import java.io.Serializable;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

public abstract class BaseObject implements Serializable {    
	private static final long serialVersionUID = -2883854210804645963L;
	public String toString(){
		return ToStringBuilder.reflectionToString(this);
	}
    public boolean equals(Object other){
    	return EqualsBuilder.reflectionEquals(this, other);
    }
    public int hashCode(){
    	return HashCodeBuilder.reflectionHashCode(this);
    }
}